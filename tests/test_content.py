import pytest
from fastapi.testclient import TestClient

from server.app import create_app


@pytest.fixture
def client(tmp_path):
    with TestClient(create_app(tmp_path)) as test_client:
        yield test_client


def demo_id(client):
    return "demo-story"


def test_demo_project_seeds_story_content(client):
    data = client.get(f"/api/projects/{demo_id(client)}/content").json()
    assert [c["id"] for c in data["characters"]] == ["narrator", "lin", "chen", "yuan"]
    assert data["characters"][0]["isNarrator"] is True
    assert len(data["scenes"]) == 6
    assert len(data["scenes"][0]["paragraphs"]) == 4
    assert len(data["scenes"][0]["shots"]) == 3
    assert data["scenes"][0]["paragraphs"][0]["kind"] == "narration"
    assert data["scenes"][0]["status"] == "done"


def test_new_project_is_blank_with_narrator_only(client):
    project = client.post("/api/projects", json={"name": "全新故事", "synopsis": "从零开始"}).json()
    data = client.get(f"/api/projects/{project['id']}/content").json()
    assert len(data["characters"]) == 1
    assert data["characters"][0]["isNarrator"] is True
    assert data["scenes"] == []
    assert project["id"] != demo_id(client)


def test_character_lifecycle_and_delete_protection(client):
    project = demo_id(client)
    created = client.post(f"/api/projects/{project}/characters", json={"name": "新角色", "nickname": "小新", "bio": "神秘人物", "avatarPrompt": "一位神秘人物肖像", "color": "blue"}).json()
    assert created["confirmed"] is False
    updated = client.patch(f"/api/characters/{created['id']}", json={"bio": "更新后的介绍"}).json()
    assert updated["bio"] == "更新后的介绍"
    assert updated["confirmed"] is False
    confirmed = client.patch(f"/api/characters/{created['id']}", json={"confirmed": True}).json()
    assert confirmed["confirmed"] is True
    blocked = client.delete(f"/api/characters/lin")
    assert blocked.status_code == 409
    removed = client.delete(f"/api/characters/{created['id']}")
    assert removed.status_code == 204
    assert client.delete("/api/characters/narrator").status_code == 409


def test_scene_and_paragraph_workflow_resets_confirmation(client):
    project = demo_id(client)
    paragraph_id = client.get(f"/api/projects/{project}/content").json()["scenes"][0]["paragraphs"][0]["id"]
    client.patch(f"/api/scenes/scene-1", json={"status": "done"})
    edited = client.patch(f"/api/paragraphs/{paragraph_id}", json={"text": "雨停了。"}).json()
    assert edited["sceneStatus"] == "draft"
    client.patch(f"/api/paragraphs/{paragraph_id}", json={"emotion": "平静"})
    status = client.get(f"/api/projects/{project}/content").json()["scenes"][0]["status"]
    assert status == "draft"
    created = client.post(f"/api/scenes/scene-1/paragraphs", json={"characterId": "lin", "kind": "dialogue", "text": "新增台词"}).json()
    assert created["position"] == 4
    client.post(f"/api/scenes/scene-1/paragraphs/reorder", json={"ids": [created["id"], paragraph_id, "scene-1-p1", "scene-1-p2", "scene-1-p3"]})
    order = [p["id"] for p in client.get(f"/api/projects/{project}/content").json()["scenes"][0]["paragraphs"]]
    assert order[0] == created["id"] and order[1] == paragraph_id
    assert client.post(f"/api/scenes/scene-1/paragraphs/reorder", json={"ids": [created["id"]]}).status_code == 422
    assert client.delete(f"/api/paragraphs/{created['id']}").status_code == 204


def test_paragraph_rejects_cross_project_speaker(client):
    project = client.post("/api/projects", json={"name": "另一个故事"}).json()
    scene = client.post(f"/api/projects/{project['id']}/scenes", json={"title": "别人的场景"}).json()
    response = client.post(f"/api/scenes/{scene['id']}/paragraphs", json={"characterId": "lin", "text": "越权"})
    assert response.status_code == 422
    blank = client.get(f"/api/projects/{project['id']}/content").json()
    assert len(blank["scenes"]) == 1 and blank["scenes"][0]["paragraphs"] == []


def test_scene_create_update_reorder_and_delete(client):
    project = demo_id(client)
    created = client.post(f"/api/projects/{project}/scenes", json={"title": "新的序幕", "place": "南城"}).json()
    assert created["position"] == 6
    client.patch(f"/api/scenes/{created['id']}", json={"summary": "补充说明"})
    ids = ["scene-6", created["id"]] + [f"scene-{i}" for i in range(1, 6)]
    client.post(f"/api/projects/{project}/scenes/reorder", json={"ids": ids})
    scenes = client.get(f"/api/projects/{project}/content").json()["scenes"]
    assert [s["id"] for s in scenes][:2] == ["scene-6", created["id"]]
    assert client.delete(f"/api/scenes/{created['id']}").status_code == 204
    assert client.patch("/api/scenes/missing", json={"title": "x"}).status_code == 404


def test_shot_prompt_and_image_url_persist(client):
    project = demo_id(client)
    created = client.post("/api/scenes/scene-2/shots", json={"prompt": "新的画面"}).json()
    updated = client.patch(f"/api/shots/{created['id']}", json={"prompt": "修正后的画面", "imageUrl": "assets/characters/lin.svg"}).json()
    assert updated["imageUrl"] == "assets/characters/lin.svg"
    shots = client.get(f"/api/projects/{project}/content").json()["scenes"][1]["shots"]
    assert len(shots) == 4 and shots[-1]["prompt"] == "修正后的画面"
    assert client.delete(f"/api/shots/{created['id']}").status_code == 204


def test_migrations_preserve_existing_v2_database(tmp_path):
    from server.database import Database
    import sqlite3

    directory = tmp_path / "legacy"
    Database(directory)
    with Database(directory).connect() as connection:
        connection.execute("DROP TABLE shots")
        connection.execute("DROP TABLE paragraphs")
        connection.execute("DROP TABLE scenes")
        connection.execute("DROP TABLE characters")
        connection.execute("DROP TABLE episodes")
        connection.execute("PRAGMA user_version = 2")
    with TestClient(create_app(directory)) as client:
        assert client.get("/api/health").json()["schemaVersion"] == 3
        data = client.get("/api/projects/demo-story/content").json()
        assert len(data["scenes"]) == 6
