import os
from pathlib import Path
from typing import Literal
from urllib.parse import urlsplit

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, SecretStr, field_validator
from starlette.middleware.trustedhost import TrustedHostMiddleware

from .database import Database, new_id, timestamp

ROOT = Path(__file__).resolve().parent.parent
Capability = Literal["text", "image", "video"]


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    synopsis: str = Field(default="", max_length=100000)

    @field_validator("name")
    @classmethod
    def valid_name(cls, value):
        if not value.strip():
            raise ValueError("项目名称不能为空")
        return value.strip()


class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    synopsis: str | None = Field(default=None, max_length=100000)
    archived: bool | None = None

    @field_validator("name")
    @classmethod
    def valid_name(cls, value):
        if value is None or not value.strip():
            raise ValueError("项目名称不能为空")
        return value.strip()


class ProviderInput(BaseModel):
    capability: Capability
    name: str = Field(min_length=1, max_length=100)
    url: str = Field(max_length=2048)
    models: list[str] = Field(min_length=1, max_length=100)
    apiKey: SecretStr | None = Field(default=None, max_length=4096)

    @field_validator("name")
    @classmethod
    def valid_name(cls, value):
        if not value.strip():
            raise ValueError("供应商名称不能为空")
        return value.strip()

    @field_validator("url")
    @classmethod
    def valid_url(cls, value):
        value = value.strip().rstrip("/")
        parsed = urlsplit(value)
        if parsed.scheme not in ("https", "http") or not parsed.hostname or parsed.username or parsed.password or parsed.query or parsed.fragment:
            raise ValueError("请输入不含凭据或查询参数的 HTTP/HTTPS 地址")
        return value

    @field_validator("models")
    @classmethod
    def valid_models(cls, values):
        models = list(dict.fromkeys(value.strip() for value in values))
        if any(not value or len(value) > 200 for value in models):
            raise ValueError("模型 ID 不能为空，长度不能超过 200")
        return models


class DefaultInput(BaseModel):
    provider: str
    model: str


class CharacterCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    nickname: str = Field(default="", max_length=120)
    role: str = Field(default="配角", max_length=40)
    bio: str = Field(default="", max_length=20000)
    avatarPrompt: str = Field(default="", max_length=8000)
    color: str = Field(default="slate", max_length=20)

    @field_validator("name")
    @classmethod
    def valid_name(cls, value):
        if not value.strip():
            raise ValueError("角色姓名不能为空")
        return value.strip()


class CharacterUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    nickname: str | None = Field(default=None, max_length=120)
    role: str | None = Field(default=None, max_length=40)
    bio: str | None = Field(default=None, max_length=20000)
    avatarPrompt: str | None = Field(default=None, max_length=8000)
    avatarUrl: str | None = Field(default=None, max_length=2048)
    voice: str | None = Field(default=None, max_length=100)
    confirmed: bool | None = None


class SceneCreate(BaseModel):
    title: str = Field(default="新的一幕", max_length=200)
    place: str = Field(default="", max_length=200)
    summary: str = Field(default="", max_length=5000)


class SceneUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    place: str | None = Field(default=None, max_length=200)
    summary: str | None = Field(default=None, max_length=5000)
    status: Literal["draft", "done"] | None = None


class ParagraphCreate(BaseModel):
    characterId: str
    kind: Literal["dialogue", "narration"] = "dialogue"
    text: str = Field(default="", max_length=20000)
    emotion: str = Field(default="", max_length=100)


class ParagraphUpdate(BaseModel):
    characterId: str | None = None
    kind: Literal["dialogue", "narration"] | None = None
    text: str | None = Field(default=None, max_length=20000)
    emotion: str | None = Field(default=None, max_length=100)


class ShotCreate(BaseModel):
    prompt: str = Field(default="", max_length=8000)


class ShotUpdate(BaseModel):
    prompt: str | None = Field(default=None, max_length=8000)
    imageUrl: str | None = Field(default=None, max_length=2048)


class ReorderInput(BaseModel):
    ids: list[str] = Field(min_length=1, max_length=2000)


def create_app(data_dir=None):
    directory = Path(data_dir or os.environ.get("MININOVEL_DATA_DIR", ROOT / ".data")).resolve()
    database = Database(directory)
    app = FastAPI(title="MiniNovel", version="0.1.0", docs_url=None, redoc_url=None)
    app.state.database = database
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1", "[::1]", "testserver"])

    @app.middleware("http")
    async def local_request_guard(request: Request, call_next):
        if request.method not in ("GET", "HEAD", "OPTIONS"):
            origin = request.headers.get("origin")
            if origin and origin != f"{request.url.scheme}://{request.headers.get('host')}":
                return JSONResponse({"detail": "只允许同源应用写入数据"}, status_code=403)
            if request.headers.get("sec-fetch-site") == "cross-site":
                return JSONResponse({"detail": "拒绝跨站请求"}, status_code=403)
            if not request.headers.get("content-type", "").startswith("application/json"):
                return JSONResponse({"detail": "写入请求必须使用 JSON"}, status_code=415)
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        if request.url.path.startswith("/api"):
            response.headers["Cache-Control"] = "no-store"
        return response

    # Validation errors must not echo the body, especially apiKey fields.
    from fastapi.exceptions import RequestValidationError

    @app.exception_handler(RequestValidationError)
    async def validation_error(request, error):
        return JSONResponse({"detail": "请求字段无效，请检查名称、地址和模型列表。"}, status_code=422)

    @app.get("/api/health")
    def health():
        return {"status": "ok", "milestone": "M1", "schemaVersion": 2, "generationEnabled": False}

    @app.get("/api/projects")
    def list_projects(include_archived: bool = False):
        with database.connect() as connection:
            rows = connection.execute(
                "SELECT * FROM projects WHERE archived = 0 OR ? ORDER BY updated_at DESC, id", (include_archived,),
            ).fetchall()
        return [dict(row) for row in rows]

    @app.post("/api/projects", status_code=201)
    def create_project(data: ProjectCreate):
        project_id, now = new_id(), timestamp()
        database.project_directory(project_id)
        with database.connect() as connection:
            connection.execute("INSERT INTO projects VALUES (?, ?, ?, 0, 0, ?, ?)", (project_id, data.name, data.synopsis, now, now))
            connection.execute("INSERT INTO episodes VALUES (?, ?, '第 01 集', 0, ?, ?)", (f"ep-{project_id[:12]}", project_id, now, now))
            connection.execute(
                "INSERT INTO characters VALUES (?, ?, '旁白', '', '旁白', '', '', '', 1, 'slate', '', 0, 1, ?, ?)",
                (f"narr-{project_id[:12]}", project_id, now, now),
            )
        return get_project(project_id)

    @app.get("/api/projects/{project_id}")
    def get_project(project_id: str):
        with database.connect() as connection:
            row = connection.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
        if row is None:
            raise HTTPException(404, "项目不存在")
        return dict(row)

    @app.patch("/api/projects/{project_id}")
    def update_project(project_id: str, data: ProjectUpdate):
        fields = data.model_dump(exclude_unset=True)
        if any(value is None for value in fields.values()):
            raise HTTPException(422, "更新字段不能为 null")
        with database.connect() as connection:
            if connection.execute("SELECT id FROM projects WHERE id = ?", (project_id,)).fetchone() is None:
                raise HTTPException(404, "项目不存在")
            if fields:
                fields["updated_at"] = timestamp()
                assignments = ", ".join(f"{field} = ?" for field in fields)
                connection.execute(f"UPDATE projects SET {assignments} WHERE id = ?", (*fields.values(), project_id))
        return get_project(project_id)

    def settings():
        result = {"providers": {cap: [] for cap in ("text", "image", "video")}, "defaults": {}, "credentialsAvailable": True}
        with database.connect() as connection:
            providers = connection.execute("SELECT * FROM providers ORDER BY created_at, id").fetchall()
            for provider in providers:
                models = connection.execute("SELECT model_id FROM provider_models WHERE provider_id = ? ORDER BY position", (provider["id"],)).fetchall()
                # Only return presence, never the secret value.
                has_key = connection.execute(
                    "SELECT EXISTS(SELECT 1 FROM provider_secrets WHERE provider_id = ? AND length(api_key) > 0)",
                    (provider["id"],),
                ).fetchone()[0] == 1
                result["providers"][provider["capability"]].append({
                    "id": provider["id"], "name": provider["name"], "url": provider["base_url"],
                    "models": [row["model_id"] for row in models], "hasKey": has_key,
                })
            for row in connection.execute("SELECT * FROM defaults"):
                result["defaults"][row["capability"]] = {"provider": row["provider_id"], "model": row["model_id"]}
        return result

    app.get("/api/settings")(settings)

    def save_provider(data, provider_id, existing=False):
        with database.connect() as connection:
            if existing:
                row = connection.execute("SELECT capability FROM providers WHERE id = ?", (provider_id,)).fetchone()
                if not row:
                    raise HTTPException(404, "供应商不存在")
                if row["capability"] != data.capability:
                    raise HTTPException(409, "供应商能力不能变更，请在对应分类添加")
            now = timestamp()
            if existing:
                connection.execute("UPDATE providers SET name = ?, base_url = ?, updated_at = ? WHERE id = ?", (data.name, data.url, now, provider_id))
            else:
                connection.execute("INSERT INTO providers VALUES (?, ?, ?, ?, ?, ?)", (provider_id, data.capability, data.name, data.url, now, now))
            if data.apiKey and data.apiKey.get_secret_value().strip():
                connection.execute(
                    "INSERT INTO provider_secrets VALUES (?, ?, ?) ON CONFLICT(provider_id) DO UPDATE SET api_key = excluded.api_key, updated_at = excluded.updated_at",
                    (provider_id, data.apiKey.get_secret_value().strip(), now),
                )
            # Add the new models before moving the default and removing old ones.
            for index, model in enumerate(data.models):
                connection.execute("INSERT INTO provider_models VALUES (?, ?, ?) ON CONFLICT(provider_id, model_id) DO UPDATE SET position = excluded.position", (provider_id, model, index))
            current = connection.execute("SELECT * FROM defaults WHERE capability = ?", (data.capability,)).fetchone()
            if current and current["provider_id"] == provider_id and current["model_id"] not in data.models:
                connection.execute("UPDATE defaults SET model_id = ? WHERE capability = ?", (data.models[0], data.capability))
            connection.execute("DELETE FROM provider_models WHERE provider_id = ? AND model_id NOT IN (" + ",".join("?" for _ in data.models) + ")", (provider_id, *data.models))
        return settings()

    @app.post("/api/providers", status_code=201)
    def create_provider(data: ProviderInput):
        return save_provider(data, new_id())

    @app.put("/api/providers/{provider_id}")
    def update_provider(provider_id: str, data: ProviderInput):
        return save_provider(data, provider_id, existing=True)

    @app.put("/api/defaults/{capability}")
    def set_default(capability: Capability, data: DefaultInput):
        with database.connect() as connection:
            row = connection.execute("SELECT p.capability FROM providers p JOIN provider_models m ON m.provider_id = p.id WHERE p.id = ? AND m.model_id = ?", (data.provider, data.model)).fetchone()
            if not row or row["capability"] != capability:
                raise HTTPException(422, "该模型不属于所选能力与供应商")
            connection.execute("UPDATE defaults SET provider_id = ?, model_id = ? WHERE capability = ?", (data.provider, data.model, capability))
        return settings()

    # ---- Story content (M2): characters, scenes, paragraphs, shots. ----

    def content_row_character(row):
        return {
            "id": row["id"], "name": row["name"], "nickname": row["nickname"], "role": row["role"],
            "bio": row["bio"], "avatarPrompt": row["avatar_prompt"], "avatarUrl": row["avatar_url"],
            "isNarrator": bool(row["is_narrator"]), "color": row["color"], "voice": row["voice"],
            "confirmed": bool(row["confirmed"]), "position": row["position"],
        }

    def get_episode(connection, project_id):
        episode = connection.execute(
            "SELECT * FROM episodes WHERE project_id = ? ORDER BY position, created_at LIMIT 1", (project_id,),
        ).fetchone()
        if episode is None:
            now = timestamp()
            connection.execute("INSERT INTO episodes VALUES (?, ?, '第 01 集', 0, ?, ?)", (f"ep-{project_id[:12]}", project_id, now, now))
            episode = connection.execute("SELECT * FROM episodes WHERE project_id = ? LIMIT 1", (project_id,)).fetchone()
        return episode

    def require_character(connection, project_id, character_id):
        row = connection.execute("SELECT * FROM characters WHERE id = ?", (character_id,)).fetchone()
        if row is None or row["project_id"] != project_id:
            raise HTTPException(422, "说话人必须属于当前项目")

    def scene_project_id(connection, scene_id):
        row = connection.execute(
            "SELECT e.project_id FROM scenes s JOIN episodes e ON e.id = s.episode_id WHERE s.id = ?", (scene_id,),
        ).fetchone()
        if row is None:
            raise HTTPException(404, "该幕不存在")
        return row["project_id"]

    def touch_project(connection, project_id):
        connection.execute("UPDATE projects SET updated_at = ? WHERE id = ?", (timestamp(), project_id))

    @app.get("/api/projects/{project_id}/content")
    def project_content(project_id: str):
        get_project(project_id)
        with database.connect() as connection:
            episode = get_episode(connection, project_id)
            characters = [content_row_character(row) for row in connection.execute(
                "SELECT * FROM characters WHERE project_id = ? ORDER BY position, created_at", (project_id,),
            )]
            scenes = []
            for scene in connection.execute("SELECT * FROM scenes WHERE episode_id = ? ORDER BY position, created_at", (episode["id"],)):
                paragraphs = [dict(row) for row in connection.execute(
                    "SELECT * FROM paragraphs WHERE scene_id = ? ORDER BY position, created_at", (scene["id"],),
                )]
                shots = [dict(row) for row in connection.execute(
                    "SELECT * FROM shots WHERE scene_id = ? ORDER BY position, created_at", (scene["id"],),
                )]
                scenes.append({
                    "id": scene["id"], "title": scene["title"], "place": scene["place"], "summary": scene["summary"],
                    "status": scene["status"], "position": scene["position"],
                    "paragraphs": [{
                        "id": p["id"], "characterId": p["character_id"], "kind": p["kind"],
                        "text": p["text"], "emotion": p["emotion"], "position": p["position"],
                    } for p in paragraphs],
                    "shots": [{
                        "id": s["id"], "prompt": s["prompt"], "imageUrl": s["image_url"], "position": s["position"],
                    } for s in shots],
                })
        return {"episode": {"id": episode["id"], "title": episode["title"]}, "characters": characters, "scenes": scenes}

    @app.post("/api/projects/{project_id}/characters", status_code=201)
    def create_character(project_id: str, data: CharacterCreate):
        get_project(project_id)
        character_id, now = new_id(), timestamp()
        with database.connect() as connection:
            position = connection.execute("SELECT COUNT(*) FROM characters WHERE project_id = ?", (project_id,)).fetchone()[0]
            connection.execute(
                "INSERT INTO characters VALUES (?, ?, ?, ?, ?, ?, ?, '', 0, ?, '', ?, 0, ?, ?)",
                (character_id, project_id, data.name, data.nickname, data.role, data.bio, data.avatarPrompt, data.color, position, now, now),
            )
            touch_project(connection, project_id)
            row = connection.execute("SELECT * FROM characters WHERE id = ?", (character_id,)).fetchone()
            return content_row_character(row)

    @app.patch("/api/characters/{character_id}")
    def update_character(character_id: str, data: CharacterUpdate):
        fields = data.model_dump(exclude_unset=True)
        column_map = {"avatarPrompt": "avatar_prompt", "avatarUrl": "avatar_url"}
        with database.connect() as connection:
            row = connection.execute("SELECT * FROM characters WHERE id = ?", (character_id,)).fetchone()
            if row is None:
                raise HTTPException(404, "角色不存在")
            updates, resets_confirmation = {}, False
            for key, value in fields.items():
                if value is None:
                    raise HTTPException(422, "更新字段不能为 null")
                column = column_map.get(key, key)
                if column == "name" and not str(value).strip():
                    raise HTTPException(422, "角色姓名不能为空")
                if key == "confirmed":
                    updates["confirmed"] = 1 if value else 0
                else:
                    updates[column] = str(value).strip() if column == "name" else value
                    if key in ("name", "nickname", "role", "bio", "avatarPrompt"):
                        resets_confirmation = True
            if updates:
                if resets_confirmation and not "confirmed" in updates:
                    updates["confirmed"] = 0
                updates["updated_at"] = timestamp()
                assignments = ", ".join(f"{column} = ?" for column in updates)
                connection.execute(f"UPDATE characters SET {assignments} WHERE id = ?", (*updates.values(), character_id))
                touch_project(connection, row["project_id"])
            return content_row_character(connection.execute("SELECT * FROM characters WHERE id = ?", (character_id,)).fetchone())

    @app.delete("/api/characters/{character_id}", status_code=204)
    def delete_character(character_id: str):
        with database.connect() as connection:
            row = connection.execute("SELECT * FROM characters WHERE id = ?", (character_id,)).fetchone()
            if row is None:
                raise HTTPException(404, "角色不存在")
            if row["is_narrator"]:
                raise HTTPException(409, "旁白是固定说话人，不能删除")
            used = connection.execute("SELECT COUNT(*) FROM paragraphs WHERE character_id = ?", (character_id,)).fetchone()[0]
            if used:
                raise HTTPException(409, f"该角色还有 {used} 段对白，请先调整这些段落的说话人")
            connection.execute("DELETE FROM characters WHERE id = ?", (character_id,))
            touch_project(connection, row["project_id"])

    @app.post("/api/projects/{project_id}/scenes", status_code=201)
    def create_scene(project_id: str, data: SceneCreate):
        get_project(project_id)
        scene_id, now = new_id(), timestamp()
        with database.connect() as connection:
            episode = get_episode(connection, project_id)
            position = connection.execute("SELECT COUNT(*) FROM scenes WHERE episode_id = ?", (episode["id"],)).fetchone()[0]
            connection.execute(
                "INSERT INTO scenes VALUES (?, ?, ?, ?, ?, 'draft', ?, ?, ?)",
                (scene_id, episode["id"], data.title, data.place, data.summary, position, now, now),
            )
            touch_project(connection, project_id)
            row = connection.execute("SELECT * FROM scenes WHERE id = ?", (scene_id,)).fetchone()
        return {"id": row["id"], "title": row["title"], "position": row["position"], "status": row["status"]}

    @app.patch("/api/scenes/{scene_id}")
    def update_scene(scene_id: str, data: SceneUpdate):
        fields = data.model_dump(exclude_unset=True)
        if any(value is None for value in fields.values()):
            raise HTTPException(422, "更新字段不能为 null")
        with database.connect() as connection:
            if connection.execute("SELECT 1 FROM scenes WHERE id = ?", (scene_id,)).fetchone() is None:
                raise HTTPException(404, "该幕不存在")
            if fields:
                updates = {key: value for key, value in fields.items()}
                updates["updated_at"] = timestamp()
                assignments = ", ".join(f"{column} = ?" for column in updates)
                connection.execute(f"UPDATE scenes SET {assignments} WHERE id = ?", (*updates.values(), scene_id))
                touch_project(connection, scene_project_id(connection, scene_id))
            row = connection.execute("SELECT * FROM scenes WHERE id = ?", (scene_id,)).fetchone()
        return {"id": row["id"], "title": row["title"], "status": row["status"], "position": row["position"]}

    @app.delete("/api/scenes/{scene_id}", status_code=204)
    def delete_scene(scene_id: str):
        with database.connect() as connection:
            project_id = scene_project_id(connection, scene_id)
            connection.execute("DELETE FROM scenes WHERE id = ?", (scene_id,))
            touch_project(connection, project_id)

    def reorder_children(connection, table, parent_column, parent_id, ids):
        existing = {row[0] for row in connection.execute(f"SELECT id FROM {table} WHERE {parent_column} = ?", (parent_id,))}
        if set(ids) != existing or len(ids) != len(existing):
            raise HTTPException(422, "排序列表必须包含该层级下全部条目")
        for position, item_id in enumerate(ids):
            connection.execute(f"UPDATE {table} SET position = ? WHERE id = ?", (position, item_id))

    @app.post("/api/projects/{project_id}/scenes/reorder")
    def reorder_scenes(project_id: str, data: ReorderInput):
        get_project(project_id)
        with database.connect() as connection:
            episode = get_episode(connection, project_id)
            reorder_children(connection, "scenes", "episode_id", episode["id"], data.ids)
            touch_project(connection, project_id)
        return {"ok": True}

    @app.post("/api/scenes/{scene_id}/paragraphs", status_code=201)
    def create_paragraph(scene_id: str, data: ParagraphCreate):
        paragraph_id, now = new_id(), timestamp()
        with database.connect() as connection:
            project_id = scene_project_id(connection, scene_id)
            require_character(connection, project_id, data.characterId)
            position = connection.execute("SELECT COUNT(*) FROM paragraphs WHERE scene_id = ?", (scene_id,)).fetchone()[0]
            connection.execute(
                "INSERT INTO paragraphs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (paragraph_id, scene_id, data.characterId, data.kind, data.text, data.emotion, position, now, now),
            )
            connection.execute("UPDATE scenes SET status = 'draft', updated_at = ? WHERE id = ?", (now, scene_id))
            touch_project(connection, project_id)
            row = connection.execute("SELECT * FROM paragraphs WHERE id = ?", (paragraph_id,)).fetchone()
        return {"id": row["id"], "characterId": row["character_id"], "kind": row["kind"], "text": row["text"], "emotion": row["emotion"], "position": row["position"], "sceneId": scene_id}

    @app.patch("/api/paragraphs/{paragraph_id}")
    def update_paragraph(paragraph_id: str, data: ParagraphUpdate):
        fields = data.model_dump(exclude_unset=True)
        if any(value is None for value in fields.values()):
            raise HTTPException(422, "更新字段不能为 null")
        with database.connect() as connection:
            row = connection.execute("SELECT * FROM paragraphs WHERE id = ?", (paragraph_id,)).fetchone()
            if row is None:
                raise HTTPException(404, "段落不存在")
            scene_id = row["scene_id"]
            project_id = scene_project_id(connection, scene_id)
            updates = {}
            for key, value in fields.items():
                updates["character_id" if key == "characterId" else key] = value
            if "character_id" in updates:
                require_character(connection, project_id, updates["character_id"])
            if updates:
                updates["updated_at"] = timestamp()
                assignments = ", ".join(f"{column} = ?" for column in updates)
                connection.execute(f"UPDATE paragraphs SET {assignments} WHERE id = ?", (*updates.values(), paragraph_id))
                content_changed = any(key in updates for key in ("text", "character_id", "kind"))
                if content_changed:
                    connection.execute("UPDATE scenes SET status = 'draft', updated_at = ? WHERE id = ?", (updates["updated_at"], scene_id))
                touch_project(connection, project_id)
            row = connection.execute("SELECT * FROM paragraphs WHERE id = ?", (paragraph_id,)).fetchone()
            status = connection.execute("SELECT status FROM scenes WHERE id = ?", (scene_id,)).fetchone()[0]
        return {"id": row["id"], "characterId": row["character_id"], "kind": row["kind"], "text": row["text"], "emotion": row["emotion"], "position": row["position"], "sceneStatus": status}

    @app.delete("/api/paragraphs/{paragraph_id}", status_code=204)
    def delete_paragraph(paragraph_id: str):
        with database.connect() as connection:
            row = connection.execute("SELECT * FROM paragraphs WHERE id = ?", (paragraph_id,)).fetchone()
            if row is None:
                raise HTTPException(404, "段落不存在")
            connection.execute("DELETE FROM paragraphs WHERE id = ?", (paragraph_id,))
            touch_project(connection, scene_project_id(connection, row["scene_id"]))

    @app.post("/api/scenes/{scene_id}/paragraphs/reorder")
    def reorder_paragraphs(scene_id: str, data: ReorderInput):
        with database.connect() as connection:
            scene_project_id(connection, scene_id)
            reorder_children(connection, "paragraphs", "scene_id", scene_id, data.ids)
            touch_project(connection, scene_project_id(connection, scene_id))
        return {"ok": True}

    @app.post("/api/scenes/{scene_id}/shots", status_code=201)
    def create_shot(scene_id: str, data: ShotCreate):
        shot_id, now = new_id(), timestamp()
        with database.connect() as connection:
            project_id = scene_project_id(connection, scene_id)
            position = connection.execute("SELECT COUNT(*) FROM shots WHERE scene_id = ?", (scene_id,)).fetchone()[0]
            connection.execute(
                "INSERT INTO shots VALUES (?, ?, ?, '', ?, ?, ?)", (shot_id, scene_id, data.prompt, position, now, now),
            )
            touch_project(connection, project_id)
            row = connection.execute("SELECT * FROM shots WHERE id = ?", (shot_id,)).fetchone()
        return {"id": row["id"], "prompt": row["prompt"], "imageUrl": row["image_url"], "position": row["position"]}

    @app.patch("/api/shots/{shot_id}")
    def update_shot(shot_id: str, data: ShotUpdate):
        fields = data.model_dump(exclude_unset=True)
        if any(value is None for value in fields.values()):
            raise HTTPException(422, "更新字段不能为 null")
        with database.connect() as connection:
            row = connection.execute("SELECT * FROM shots WHERE id = ?", (shot_id,)).fetchone()
            if row is None:
                raise HTTPException(404, "镜头不存在")
            updates = {}
            for key, value in fields.items():
                updates["image_url" if key == "imageUrl" else key] = value
            updates["updated_at"] = timestamp()
            assignments = ", ".join(f"{column} = ?" for column in updates)
            connection.execute(f"UPDATE shots SET {assignments} WHERE id = ?", (*updates.values(), shot_id))
            touch_project(connection, scene_project_id(connection, row["scene_id"]))
            row = connection.execute("SELECT * FROM shots WHERE id = ?", (shot_id,)).fetchone()
        return {"id": row["id"], "prompt": row["prompt"], "imageUrl": row["image_url"], "position": row["position"]}

    @app.delete("/api/shots/{shot_id}", status_code=204)
    def delete_shot(shot_id: str):
        with database.connect() as connection:
            row = connection.execute("SELECT * FROM shots WHERE id = ?", (shot_id,)).fetchone()
            if row is None:
                raise HTTPException(404, "镜头不存在")
            connection.execute("DELETE FROM shots WHERE id = ?", (shot_id,))
            touch_project(connection, scene_project_id(connection, row["scene_id"]))

    @app.get("/api/projects/{project_id}/assets/{asset_path:path}")
    def project_asset(project_id: str, asset_path: str):
        get_project(project_id)
        folder = (database.assets / project_id).resolve()
        target = (folder / asset_path).resolve()
        if not target.is_relative_to(folder) or not target.is_file():
            raise HTTPException(404, "素材不存在")
        # M1 only serves media, never application data or scripts.
        media = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".mp3": "audio/mpeg", ".wav": "audio/wav", ".mp4": "video/mp4"}
        content_type = media.get(target.suffix.lower())
        if not content_type:
            raise HTTPException(404, "不支持的素材类型")
        return FileResponse(target, media_type=content_type)

    @app.get("/")
    def index():
        return FileResponse(ROOT / "index.html")

    @app.get("/app.js")
    def javascript():
        return FileResponse(ROOT / "app.js", media_type="application/javascript")

    @app.get("/styles.css")
    def stylesheet():
        return FileResponse(ROOT / "styles.css", media_type="text/css")

    app.mount("/assets", StaticFiles(directory=ROOT / "assets"), name="assets")
    return app
