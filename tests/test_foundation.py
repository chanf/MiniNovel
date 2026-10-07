import shutil

import pytest
from fastapi.testclient import TestClient

from server.app import create_app


@pytest.fixture
def workspace(tmp_path):
    app = create_app(tmp_path)
    with TestClient(app) as client:
        yield client, app, tmp_path


def provider(capability="text", models=None):
    return {"capability": capability, "name": "测试网关", "url": "https://api.example.com/v1", "models": models or ["alpha", "beta"]}


def test_initialization_is_idempotent(workspace):
    client, _, directory = workspace
    assert client.get("/api/health").json()["schemaVersion"] == 3
    assert len(client.get("/api/projects").json()) == 1
    assert client.get("/api/projects").json()[0]["is_demo"] == 1
    with TestClient(create_app(directory)) as restarted:
        assert len(restarted.get("/api/projects").json()) == 1
        assert len(restarted.get("/api/settings").json()["providers"]["text"]) == 1


def test_project_isolation_archive_and_restore(workspace):
    client, _, directory = workspace
    a = client.post("/api/projects", json={"name": "故事 A", "synopsis": "独立内容"}).json()
    b = client.post("/api/projects", json={"name": "故事 B"}).json()
    assert a["id"] != b["id"]
    assert (directory / "projects" / a["id"]).is_dir()
    client.patch(f"/api/projects/{a['id']}", json={"name": "新名称", "archived": True})
    assert client.get(f"/api/projects/{b['id']}").json()["name"] == "故事 B"
    assert a["id"] not in [p["id"] for p in client.get("/api/projects").json()]
    assert a["id"] in [p["id"] for p in client.get("/api/projects?include_archived=true").json()]
    client.patch(f"/api/projects/{a['id']}", json={"archived": False})
    with TestClient(create_app(directory)) as restarted:
        assert restarted.get(f"/api/projects/{a['id']}").json()["name"] == "新名称"
    assert client.get("/api/projects/unknown").status_code == 404
    assert client.post("/api/projects", json={"name": "  "}).status_code == 422
    assert client.patch(f"/api/projects/{a['id']}", json={"synopsis": None}).status_code == 422


def test_providers_and_defaults_survive_restart(workspace):
    client, _, directory = workspace
    before = client.get("/api/settings").json()
    response = client.post("/api/providers", json=provider())
    assert response.status_code == 201
    item = next(p for p in response.json()["providers"]["text"] if p["name"] == "测试网关")
    assert client.put("/api/defaults/text", json={"provider": item["id"], "model": "beta"}).status_code == 200
    assert client.put("/api/defaults/image", json={"provider": item["id"], "model": "beta"}).status_code == 422
    client.put(f"/api/providers/{item['id']}", json=provider(models=["alpha"]))
    with TestClient(create_app(directory)) as restarted:
        current = restarted.get("/api/settings").json()
    assert current["defaults"]["text"] == {"provider": item["id"], "model": "alpha"}
    assert current["defaults"]["image"] == before["defaults"]["image"]
    assert current["defaults"]["video"] == before["defaults"]["video"]
    assert client.put(f"/api/providers/{item['id']}", json=provider("video")).status_code == 409


def test_secrets_persist_in_sqlite_but_are_never_returned(workspace):
    client, app, directory = workspace
    payload = {**provider(), "apiKey": "test-secret-only-for-unit-test"}
    response = client.post("/api/providers", json=payload)
    assert response.status_code == 201
    assert payload["apiKey"] not in response.text
    item = next(p for p in response.json()["providers"]["text"] if p["name"] == "测试网关")
    assert item["hasKey"] is True
    with app.state.database.connect() as connection:
        assert connection.execute("SELECT api_key FROM provider_secrets WHERE provider_id = ?", (item["id"],)).fetchone()[0] == payload["apiKey"]
    invalid = client.post("/api/providers", json={**payload, "models": []})
    assert invalid.status_code == 422
    assert payload["apiKey"] not in invalid.text
    # Empty or omitted keys preserve the existing key.
    for value in (None, "", "   "):
        assert client.put(f"/api/providers/{item['id']}", json={**provider(), "apiKey": value}).status_code == 200
    with TestClient(create_app(directory)) as restarted:
        settings = restarted.get("/api/settings")
        assert payload["apiKey"] not in settings.text
        assert next(p for p in settings.json()["providers"]["text"] if p["id"] == item["id"])["hasKey"]
    replacement = "test-replacement-secret"
    client.put(f"/api/providers/{item['id']}", json={**provider(), "apiKey": replacement})
    with app.state.database.connect() as connection:
        assert connection.execute("SELECT api_key FROM provider_secrets WHERE provider_id = ?", (item["id"],)).fetchone()[0] == replacement
    assert (directory / "mininovel.sqlite3").stat().st_mode & 0o777 == 0o600


def test_v1_migration_preserves_configuration_and_backups_include_keys(workspace, tmp_path):
    client, app, directory = workspace
    defaults = client.get("/api/settings").json()["defaults"]
    with app.state.database.connect() as connection:
        # Rebuild a true v1 layout: content tables did not exist before M2.
        for table in ("shots", "paragraphs", "scenes", "characters", "episodes", "provider_secrets"):
            connection.execute(f"DROP TABLE IF EXISTS {table}")
        connection.execute("PRAGMA user_version = 1")
    migrated = create_app(directory)
    with TestClient(migrated) as restarted:
        assert restarted.get("/api/health").json()["schemaVersion"] == 3
        assert restarted.get("/api/settings").json()["defaults"] == defaults
        restarted.put("/api/providers/agnes-text", json={"capability": "text", "name": "Agnes AI", "url": "https://apihub.agnes-ai.com/v1", "models": ["agnes-2.5-flash"], "apiKey": "backup-test-secret"})
    restored_dir = tmp_path / "restored"
    restored_dir.mkdir()
    shutil.copy2(directory / "mininovel.sqlite3", restored_dir / "mininovel.sqlite3")
    with TestClient(create_app(restored_dir)) as restored:
        assert restored.get("/api/settings").json()["providers"]["text"][0]["hasKey"]


def test_static_paths_and_assets_are_restricted(workspace):
    client, app, directory = workspace
    for path in ("/.data/mininovel.sqlite3", "/server/app.py", "/pyproject.toml", "/.env", "/todo.md"):
        assert client.get(path).status_code == 404
    assert client.get("/").status_code == 200
    assert client.get("/assets/characters/lin.svg").status_code == 200
    folder = app.state.database.assets / "demo-story"
    (folder / "sample.mp3").write_bytes(b"sample")
    (folder / "private.txt").write_text("private")
    (folder / "escape.mp3").symlink_to(directory / "mininovel.sqlite3")
    assert client.get("/api/projects/demo-story/assets/sample.mp3").status_code == 200
    assert client.get("/api/projects/demo-story/assets/private.txt").status_code == 404
    assert client.get("/api/projects/demo-story/assets/escape.mp3").status_code == 404
    assert client.get("/api/projects/demo-story/assets/%2E%2E/mininovel.sqlite3").status_code == 404


def test_cross_site_writes_and_invalid_host_are_rejected(workspace):
    client, _, _ = workspace
    assert client.post("/api/projects", json={"name": "bad"}, headers={"origin": "https://other.example"}).status_code == 403
    assert client.post("/api/projects", json={"name": "bad"}, headers={"sec-fetch-site": "cross-site"}).status_code == 403
    assert client.post("/api/projects", content='{"name":"bad"}', headers={"content-type": "text/plain"}).status_code == 415
    assert client.get("/api/health", headers={"host": "other.example"}).status_code == 400
    assert client.post("/api/projects", json={"name": "ok"}, headers={"origin": "http://testserver"}).status_code == 201
