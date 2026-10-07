import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4


DEFAULTS = {
    "text": ["agnes-2.5-flash", "agnes-2.0-flash"],
    "image": ["agnes-image-2.1-flash", "agnes-image-2.0-flash"],
    "video": ["agnes-video-v2.0"],
}


DEMO_CHARACTERS = [
    ("narrator", "旁白", "", "旁白", "低沉醇厚，娓娓道来", "slate", "Uncle_Fu", 1, 1, ""),
    ("lin", "林晚", "晚晚", "主角", "28 岁，南城人。十年前弟弟失踪后，她一直守着最后一个约定。她话不多，习惯把情绪藏在简单的对白和停顿里。故事从她登上雨夜的末班车开始。", "purple", "Serena", 0, 1,
     "28 岁的中国女性，黑色齐肩直发，清瘦脸庞，眼神安静而有心事，米色风衣。正面半身肖像，冷蓝灰背景，柔和暖色侧光，电影感叙事插画，细腻笔触，1:1 方形构图，面部居中，适合裁切为圆形头像，不含文字。"),
    ("chen", "陈师傅", "老陈", "重要配角", "56 岁，末班公交的司机。温和、寡言，像一位历经世事的老朋友。他知道林晚等待的秘密，却不急着说破，带她重新走过记忆中的街道。", "amber", "Uncle_Fu", 0, 1,
     "56 岁的中国男性，短灰发，眼角有细纹，沉稳温和的神情，深灰绿色公交司机制服。正面半身肖像，低饱和暖灰背景，柔和站台灯光，电影感叙事插画，细腻笔触，1:1 方形构图，面部居中，适合圆形头像，不含文字。"),
    ("yuan", "林远", "小远", "关键角色", "18 岁，林晚的弟弟，停留在姐姐记忆中的少年。穿着干净的白衬衫，笑容腼腆而明朗。他的出现，让林晚终于学会告别，继续往前走。", "blue", "Dylan", 0, 1,
     "18 岁的中国男性，黑色短发，清秀年轻的面庞，腼腆明朗的笑容，干净的白衬衫。正面半身肖像，浅蓝灰背景，清晨般柔和光线，电影感叙事插画，细腻笔触，1:1 方形构图，面部居中，适合圆形头像，不含文字。"),
]
DEMO_AVATARS = {"lin": "assets/characters/lin.svg", "chen": "assets/characters/chen.svg", "yuan": "assets/characters/yuan.svg"}
DEMO_SCENES = [
    ("scene-1", "雨夜的末班车", "南城 / 公交站", "雨夜，寂静的南城街道。建立林晚的等待与陈师傅的相遇。", "done", [
        ("narrator", "雨下了整整一夜。南城最后一班公交，停在一座没有人的车站。"),
        ("lin", "师傅，这辆车……还到青山路吗？"),
        ("chen", "上车吧。这么晚了，怎么还一个人在外面？"),
        ("lin", "我在等一个人。他说，会坐最后一班车回来。"),
    ]),
    ("scene-2", "一封没有署名的信", "南城 / 车厢内", "车厢中发现一封写着林晚名字的信。", "done", [
        ("narrator", "林晚坐到最后一排。座位上放着一封信，信封边角已经被雨水洇湿。"),
        ("lin", "这是谁落下的？"),
        ("chen", "那封信，在这里放了好些年了。"),
        ("lin", "可是……上面写着我的名字。"),
    ]),
    ("scene-3", "迟到十年的约定", "青山路 / 旧站台", "林晚拆开信封，熟悉的笔迹让她停住呼吸。", "draft", [
        ("narrator", "窗外的街灯一盏盏退去。林晚拆开信封，熟悉的笔迹让她忽然停住了呼吸。"),
        ("lin", "“如果我迟到了，就在老地方等我。”"),
        ("chen", "你等的人，是不是叫林远？"),
        ("lin", "你怎么知道他的名字？"),
    ]),
    ("scene-4", "消失的站牌", "青山路 / 路口", "十年前拆掉的站牌重新出现。", "draft", [
        ("narrator", "公交车停下的时候，雨突然小了。十年前拆掉的站牌，竟然还立在路边。"),
        ("lin", "这个站……不是早就拆了吗？"),
        ("chen", "有些地方，只对还在等的人开放。"),
    ]),
    ("scene-5", "再见，不必等到晴天", "青山路 / 旧站台", "站台尽头的少年向林晚挥手。", "draft", [
        ("narrator", "站台尽头，一个穿白衬衫的少年正朝她挥手。和记忆里一样，他笑得有些腼腆。"),
        ("yuan", "姐，对不起，让你等了这么久。"),
        ("lin", "我还以为，你把回家的路忘了。"),
        ("yuan", "这次，我陪你走一段。"),
    ]),
    ("scene-6", "天亮以后", "南城 / 公交站", "清晨到来，林晚学会告别。", "draft", [
        ("narrator", "清晨的第一束光穿过云层。林晚站在熟悉的车站，掌心的信已经干了。"),
        ("lin", "我不等了。以后，我会好好往前走。"),
        ("narrator", "第一班公交来了。这一次，她没有回头。"),
    ]),
]
DEMO_SHOT_PROMPTS = [
    "雨夜的城市公交站，年轻女子撑着深灰色雨伞，米色风衣，远处末班车缓缓驶来。冷蓝色调，暖色站台灯光，电影感叙事插画，保留画面下方字幕空间。",
    "公交车厢内部，末排座位上放着一封被雨水洇湿的信封，灯光昏黄。电影感叙事插画，保留画面下方字幕空间。",
    "雨夜街道尽头，空旷的公交站台亮着暖色灯光，雨丝斜落。冷蓝色调，电影感叙事插画，保留画面下方字幕空间。",
]


def timestamp():
    return datetime.now(timezone.utc).isoformat()


def new_id():
    return uuid4().hex


class Database:
    def __init__(self, directory):
        self.directory = Path(directory).resolve()
        self.directory.mkdir(parents=True, exist_ok=True, mode=0o700)
        self.path = self.directory / "mininovel.sqlite3"
        self.assets = self.directory / "projects"
        self.assets.mkdir(exist_ok=True, mode=0o700)
        self.initialize()

    @contextmanager
    def connect(self):
        connection = sqlite3.connect(self.path, timeout=10)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        try:
            with connection:
                yield connection
        finally:
            connection.close()

    def initialize(self):
        with self.connect() as connection:
            version = connection.execute("PRAGMA user_version").fetchone()[0]
            if version > 3:
                raise RuntimeError("数据库版本高于当前应用，请升级应用后打开。")
            if version >= 1:
                if version == 1:
                    self.migrate_credentials(connection)
                if version <= 2:
                    self.migrate_content(connection)
                os.chmod(self.path, 0o600)
                return
            connection.executescript("""
                BEGIN IMMEDIATE;
                CREATE TABLE projects (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    synopsis TEXT NOT NULL DEFAULT '',
                    is_demo INTEGER NOT NULL DEFAULT 0,
                    archived INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE providers (
                    id TEXT PRIMARY KEY,
                    capability TEXT NOT NULL CHECK(capability IN ('text','image','video')),
                    name TEXT NOT NULL,
                    base_url TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    UNIQUE(id, capability)
                );
                CREATE TABLE provider_models (
                    provider_id TEXT NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
                    model_id TEXT NOT NULL,
                    position INTEGER NOT NULL,
                    PRIMARY KEY(provider_id, model_id)
                );
                CREATE TABLE defaults (
                    capability TEXT PRIMARY KEY CHECK(capability IN ('text','image','video')),
                    provider_id TEXT NOT NULL,
                    model_id TEXT NOT NULL,
                    FOREIGN KEY(provider_id, capability) REFERENCES providers(id, capability),
                    FOREIGN KEY(provider_id, model_id) REFERENCES provider_models(provider_id, model_id)
                );
            """)
            now = timestamp()
            connection.execute(
                "INSERT INTO projects VALUES (?, ?, ?, 1, 0, ?, ?)",
                ("demo-story", "末班车的来信", "一个雨夜，林晚在末班车上收到一封十年前的信。", now, now),
            )
            for capability, models in DEFAULTS.items():
                provider_id = f"agnes-{capability}"
                connection.execute(
                    "INSERT INTO providers VALUES (?, ?, ?, ?, ?, ?)",
                    (provider_id, capability, "Agnes AI", "https://apihub.agnes-ai.com/v1", now, now),
                )
                connection.executemany(
                    "INSERT INTO provider_models VALUES (?, ?, ?)",
                    [(provider_id, model, index) for index, model in enumerate(models)],
                )
                connection.execute("INSERT INTO defaults VALUES (?, ?, ?)", (capability, provider_id, models[0]))
            self.migrate_credentials(connection)
            self.migrate_content(connection)
        os.chmod(self.path, 0o600)
        self.project_directory("demo-story")

    @staticmethod
    def migrate_credentials(connection):
        if not connection.in_transaction:
            connection.execute("BEGIN IMMEDIATE")
        connection.execute("""
            CREATE TABLE provider_secrets (
                provider_id TEXT PRIMARY KEY REFERENCES providers(id) ON DELETE CASCADE,
                api_key TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)
        connection.execute("PRAGMA user_version = 2")

    @staticmethod
    def migrate_content(connection):
        now = timestamp()
        if not connection.in_transaction:
            connection.execute("BEGIN IMMEDIATE")
        connection.executescript("""
            CREATE TABLE episodes (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                title TEXT NOT NULL DEFAULT '第 01 集',
                position INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE TABLE characters (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                nickname TEXT NOT NULL DEFAULT '',
                role TEXT NOT NULL DEFAULT '配角',
                bio TEXT NOT NULL DEFAULT '',
                avatar_prompt TEXT NOT NULL DEFAULT '',
                avatar_url TEXT NOT NULL DEFAULT '',
                is_narrator INTEGER NOT NULL DEFAULT 0,
                color TEXT NOT NULL DEFAULT 'slate',
                voice TEXT NOT NULL DEFAULT '',
                position INTEGER NOT NULL DEFAULT 0,
                confirmed INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE TABLE scenes (
                id TEXT PRIMARY KEY,
                episode_id TEXT NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
                title TEXT NOT NULL DEFAULT '新的一幕',
                place TEXT NOT NULL DEFAULT '',
                summary TEXT NOT NULL DEFAULT '',
                status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','done')),
                position INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE TABLE paragraphs (
                id TEXT PRIMARY KEY,
                scene_id TEXT NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
                character_id TEXT NOT NULL REFERENCES characters(id),
                kind TEXT NOT NULL DEFAULT 'dialogue' CHECK(kind IN ('dialogue','narration')),
                text TEXT NOT NULL DEFAULT '',
                emotion TEXT NOT NULL DEFAULT '',
                position INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE TABLE shots (
                id TEXT PRIMARY KEY,
                scene_id TEXT NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
                prompt TEXT NOT NULL DEFAULT '',
                image_url TEXT NOT NULL DEFAULT '',
                position INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE INDEX idx_characters_project ON characters(project_id, position);
            CREATE INDEX idx_scenes_episode ON scenes(episode_id, position);
            CREATE INDEX idx_paragraphs_scene ON paragraphs(scene_id, position);
            CREATE INDEX idx_shots_scene ON shots(scene_id, position);
        """)
        has_demo = connection.execute("SELECT 1 FROM projects WHERE id = 'demo-story'").fetchone()
        if has_demo and not connection.execute("SELECT 1 FROM characters WHERE project_id = 'demo-story' LIMIT 1").fetchone():
            connection.executemany(
                "INSERT INTO characters VALUES (?, 'demo-story', ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)",
                [
                    (cid, name, nickname, role, bio, DEMO_AVATARS.get(cid, ""), DEMO_AVATARS.get(cid, ""), is_narrator, color, voice, confirmed, now, now)
                    for cid, name, nickname, role, bio, color, voice, is_narrator, confirmed, _ in DEMO_CHARACTERS
                ],
            )
            connection.execute(
                "INSERT INTO episodes VALUES ('episode-demo', 'demo-story', '第 01 集', 0, ?, ?)", (now, now),
            )
            for index, (sid, title, place, summary, status, paragraphs) in enumerate(DEMO_SCENES):
                connection.execute(
                    "INSERT INTO scenes VALUES (?, 'episode-demo', ?, ?, ?, ?, ?, ?, ?)",
                    (sid, title, place, summary, status, index, now, now),
                )
                for order, (speaker, text) in enumerate(paragraphs):
                    connection.execute(
                        "INSERT INTO paragraphs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        (f"{sid}-p{order}", sid, speaker, "narration" if speaker == "narrator" else "dialogue", text, "", order, now, now),
                    )
                for shot_order in range(3):
                    connection.execute(
                        "INSERT INTO shots VALUES (?, ?, ?, '', ?, ?, ?)",
                        (f"{sid}-s{shot_order}", sid, DEMO_SHOT_PROMPTS[shot_order], shot_order, now, now),
                    )
        connection.execute("PRAGMA user_version = 3")

    def project_directory(self, project_id):
        # IDs are generated by the application; never use a submitted path.
        directory = self.assets / project_id
        directory.mkdir(exist_ok=True, mode=0o700)
        return directory
