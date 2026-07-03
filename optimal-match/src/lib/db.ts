import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import type { CreateProfileInput, Profile, Values } from "./types";
import { clampSincerity } from "./sincerity";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "match.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initSchema(db);
  }
  return db;
}

function columnExists(database: Database.Database, table: string, column: string) {
  const columns = database
    .prepare(`PRAGMA table_info(${table})`)
    .all() as { name: string }[];
  return columns.some((c) => c.name === column);
}

function parseProfile(row: Record<string, unknown>): Profile {
  return {
    id: row.id as number,
    name: row.name as string,
    age: row.age as number,
    bio: row.bio as string,
    interests: JSON.parse(row.interests as string) as string[],
    looking_for: row.looking_for as Profile["looking_for"],
    values: JSON.parse(row.values_json as string) as Values,
    sincerity: clampSincerity((row.sincerity as number) ?? 3),
    is_me: Boolean(row.is_me),
    created_at: row.created_at as string,
  };
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      bio TEXT NOT NULL DEFAULT '',
      interests TEXT NOT NULL DEFAULT '[]',
      looking_for TEXT NOT NULL,
      values_json TEXT NOT NULL DEFAULT '{}',
      sincerity INTEGER NOT NULL DEFAULT 3,
      is_me INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);

  if (!columnExists(database, "profiles", "sincerity")) {
    database.exec("ALTER TABLE profiles ADD COLUMN sincerity INTEGER NOT NULL DEFAULT 3");
  }

  const count = (database.prepare("SELECT COUNT(*) as c FROM profiles").get() as { c: number }).c;
  if (count === 0) seedProfiles(database);
  else patchSeedSincerity(database);
}

/** 既存シードに遊び/誠実スコアを付与（初回マイグレーション用） */
function patchSeedSincerity(database: Database.Database) {
  const presets: Record<string, number> = {
    さくら: 5,
    健太: 4,
    美咲: 4,
    大輔: 2,
    ゆい: 4,
    亮: 5,
    あかり: 1,
    翔: 5,
  };
  const rows = database.prepare("SELECT id, name, sincerity FROM profiles WHERE is_me = 0").all() as {
    id: number;
    name: string;
    sincerity: number;
  }[];
  const update = database.prepare("UPDATE profiles SET sincerity = ? WHERE id = ?");
  for (const row of rows) {
    if (row.name in presets && row.sincerity === 3) {
      update.run(presets[row.name], row.id);
    }
  }
}

function seedProfiles(database: Database.Database) {
  const samples: (Omit<CreateProfileInput, "is_me">)[] = [
    { name: "さくら", age: 28, bio: "週末はカフェ巡りと読書。落ち着いた関係を大切にしたいです。", interests: ["カフェ", "読書", "映画", "旅行"], looking_for: "dating", values: { social: 3, career: 4, family: 4, adventure: 2 }, sincerity: 5 },
    { name: "健太", age: 32, bio: "スタートアップで働いています。一緒に成長できる人を探しています。", interests: ["起業", "テクノロジー", "スポーツ", "カフェ"], looking_for: "business", values: { social: 4, career: 5, family: 2, adventure: 4 }, sincerity: 4 },
    { name: "美咲", age: 26, bio: "ヨガインストラクター。心と体のバランスを大事にする仲間が欲しいです。", interests: ["ヨガ", "料理", "音楽", "ペット"], looking_for: "friendship", values: { social: 5, career: 3, family: 3, adventure: 3 }, sincerity: 4 },
    { name: "大輔", age: 35, bio: "写真が趣味のエンジニア。新しい場所と出会いを求めてます。", interests: ["写真", "旅行", "テクノロジー", "ゲーム"], looking_for: "dating", values: { social: 3, career: 4, family: 3, adventure: 5 }, sincerity: 2 },
    { name: "ゆい", age: 29, bio: "マーケター。クリエイティブな議論ができるパートナーを探しています。", interests: ["アート", "映画", "カフェ", "起業"], looking_for: "business", values: { social: 4, career: 5, family: 2, adventure: 4 }, sincerity: 4 },
    { name: "亮", age: 40, bio: "キャリア10年のPM。後輩のメンタリングが得意です。", interests: ["読書", "テクノロジー", "スポーツ", "起業"], looking_for: "mentor", values: { social: 3, career: 5, family: 4, adventure: 2 }, sincerity: 5 },
    { name: "あかり", age: 24, bio: "音楽フェスが好き！一緒にライブに行ける友達募集。", interests: ["音楽", "旅行", "ゲーム", "写真"], looking_for: "friendship", values: { social: 5, career: 2, family: 2, adventure: 5 }, sincerity: 1 },
    { name: "翔", age: 31, bio: "料理男子。食を通じて仲良くなれる関係が理想です。", interests: ["料理", "カフェ", "映画", "ペット"], looking_for: "dating", values: { social: 4, career: 3, family: 4, adventure: 3 }, sincerity: 5 },
  ];

  const insert = database.prepare(`
    INSERT INTO profiles (name, age, bio, interests, looking_for, values_json, sincerity, is_me)
    VALUES (@name, @age, @bio, @interests, @looking_for, @values_json, @sincerity, 0)
  `);

  for (const s of samples) {
    insert.run({
      ...s,
      interests: JSON.stringify(s.interests),
      values_json: JSON.stringify(s.values),
    });
  }
}

export function getMyProfile(): Profile | null {
  const row = getDb().prepare("SELECT * FROM profiles WHERE is_me = 1 LIMIT 1").get();
  return row ? parseProfile(row as Record<string, unknown>) : null;
}

export function getAllProfiles(): Profile[] {
  return getDb()
    .prepare("SELECT * FROM profiles ORDER BY is_me DESC, id ASC")
    .all()
    .map((r) => parseProfile(r as Record<string, unknown>));
}

export function getProfileById(id: number): Profile | null {
  const row = getDb().prepare("SELECT * FROM profiles WHERE id = ?").get(id);
  return row ? parseProfile(row as Record<string, unknown>) : null;
}

export function upsertMyProfile(input: CreateProfileInput): Profile {
  const database = getDb();
  const existing = getMyProfile();
  const sincerity = clampSincerity(input.sincerity ?? 3);

  const payload = {
    name: input.name,
    age: input.age,
    bio: input.bio,
    interests: JSON.stringify(input.interests),
    looking_for: input.looking_for,
    values_json: JSON.stringify(input.values),
    sincerity,
  };

  if (existing) {
    database
      .prepare(
        `UPDATE profiles SET name=@name, age=@age, bio=@bio, interests=@interests,
         looking_for=@looking_for, values_json=@values_json, sincerity=@sincerity WHERE id=@id`
      )
      .run({ ...payload, id: existing.id });
    return getProfileById(existing.id)!;
  }

  const result = database
    .prepare(
      `INSERT INTO profiles (name, age, bio, interests, looking_for, values_json, sincerity, is_me)
       VALUES (@name, @age, @bio, @interests, @looking_for, @values_json, @sincerity, 1)`
    )
    .run(payload);

  return getProfileById(Number(result.lastInsertRowid))!;
}
