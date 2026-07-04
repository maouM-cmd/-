import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import {
  generateSessionToken,
  hashPassword,
  verifyPassword,
} from "./auth";
import type { CreateProfileInput, Profile, User, Values } from "./types";
import { clampSincerity } from "./sincerity";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "match.db");
const SESSION_DAYS = 7;

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
  const userId = row.user_id as number | null | undefined;
  return {
    id: row.id as number,
    user_id: userId ?? null,
    name: row.name as string,
    age: row.age as number,
    bio: row.bio as string,
    interests: JSON.parse(row.interests as string) as string[],
    looking_for: row.looking_for as Profile["looking_for"],
    values: JSON.parse(row.values_json as string) as Values,
    sincerity: clampSincerity((row.sincerity as number) ?? 3),
    photo_path: (row.photo_path as string | null) ?? null,
    is_me: Boolean(row.is_me),
    created_at: row.created_at as string,
  };
}

function parseUser(row: Record<string, unknown>): User {
  return {
    id: row.id as number,
    email: row.email as string,
    display_name: row.display_name as string,
    created_at: row.created_at as string,
  };
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      bio TEXT NOT NULL DEFAULT '',
      interests TEXT NOT NULL DEFAULT '[]',
      looking_for TEXT NOT NULL,
      values_json TEXT NOT NULL DEFAULT '{}',
      sincerity INTEGER NOT NULL DEFAULT 3,
      photo_path TEXT,
      is_me INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  if (!columnExists(database, "profiles", "photo_path")) {
    database.exec("ALTER TABLE profiles ADD COLUMN photo_path TEXT");
  }

  database.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_user_id INTEGER NOT NULL,
      to_profile_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      UNIQUE(from_user_id, to_profile_id),
      FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (to_profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );
  `);

  if (!columnExists(database, "profiles", "sincerity")) {
    database.exec("ALTER TABLE profiles ADD COLUMN sincerity INTEGER NOT NULL DEFAULT 3");
  }
  if (!columnExists(database, "profiles", "user_id")) {
    database.exec("ALTER TABLE profiles ADD COLUMN user_id INTEGER UNIQUE");
  }

  const count = (database.prepare("SELECT COUNT(*) as c FROM profiles WHERE user_id IS NULL").get() as { c: number }).c;
  if (count === 0) seedProfiles(database);
  else patchSeedSincerity(database);
}

function patchSeedSincerity(database: Database.Database) {
  const presets: Record<string, number> = {
    さくら: 5, 健太: 4, 美咲: 4, 大輔: 2, ゆい: 4, 亮: 5, あかり: 1, 翔: 5,
  };
  const rows = database.prepare("SELECT id, name, sincerity FROM profiles WHERE user_id IS NULL").all() as {
    id: number; name: string; sincerity: number;
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
    INSERT INTO profiles (name, age, bio, interests, looking_for, values_json, sincerity, is_me, user_id)
    VALUES (@name, @age, @bio, @interests, @looking_for, @values_json, @sincerity, 0, NULL)
  `);

  for (const s of samples) {
    insert.run({
      ...s,
      interests: JSON.stringify(s.interests),
      values_json: JSON.stringify(s.values),
    });
  }
}

// --- Auth ---

export function createUser(email: string, password: string, displayName: string): User {
  const database = getDb();
  const existing = database.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
  if (existing) throw new Error("EMAIL_EXISTS");

  const result = database
    .prepare(
      `INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)`
    )
    .run(email.toLowerCase(), hashPassword(password), displayName.trim());

  return parseUser(
    database.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid) as Record<string, unknown>
  );
}

export function authenticateUser(email: string, password: string): User | null {
  const row = getDb()
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase()) as Record<string, unknown> | undefined;
  if (!row) return null;
  if (!verifyPassword(password, row.password_hash as string)) return null;
  return parseUser(row);
}

export function createSession(userId: number): string {
  const database = getDb();
  const token = generateSessionToken();
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DAYS);

  database
    .prepare(`INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)`)
    .run(userId, token, expires.toISOString());

  return token;
}

export function deleteSession(token: string): void {
  getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function getUserBySession(token: string): User | null {
  const row = getDb()
    .prepare(
      `SELECT u.* FROM users u
       JOIN sessions s ON s.user_id = u.id
       WHERE s.token = ? AND datetime(s.expires_at) > datetime('now')`
    )
    .get(token) as Record<string, unknown> | undefined;
  return row ? parseUser(row) : null;
}

// --- Profiles ---

export function getProfileByUserId(userId: number): Profile | null {
  const row = getDb().prepare("SELECT * FROM profiles WHERE user_id = ?").get(userId);
  return row ? parseProfile(row as Record<string, unknown>) : null;
}

/** @deprecated use getProfileByUserId */
export function getMyProfile(): Profile | null {
  return null;
}

export function getDiscoverableProfiles(excludeProfileId?: number): Profile[] {
  const rows = excludeProfileId
    ? getDb().prepare("SELECT * FROM profiles WHERE id != ? ORDER BY id ASC").all(excludeProfileId)
    : getDb().prepare("SELECT * FROM profiles ORDER BY id ASC").all();
  return rows.map((r) => parseProfile(r as Record<string, unknown>));
}

export function getAllProfiles(): Profile[] {
  return getDiscoverableProfiles();
}

export function getProfileById(id: number): Profile | null {
  const row = getDb().prepare("SELECT * FROM profiles WHERE id = ?").get(id);
  return row ? parseProfile(row as Record<string, unknown>) : null;
}

export function upsertUserProfile(userId: number, input: CreateProfileInput): Profile {
  const database = getDb();
  const existing = getProfileByUserId(userId);
  const sincerity = clampSincerity(input.sincerity ?? 3);

  const payload = {
    name: input.name,
    age: input.age,
    bio: input.bio,
    interests: JSON.stringify(input.interests),
    looking_for: input.looking_for,
    values_json: JSON.stringify(input.values),
    sincerity,
    user_id: userId,
  };

  if (existing) {
    database
      .prepare(
        `UPDATE profiles SET name=@name, age=@age, bio=@bio, interests=@interests,
         looking_for=@looking_for, values_json=@values_json, sincerity=@sincerity
         WHERE user_id=@user_id`
      )
      .run(payload);
    return getProfileByUserId(userId)!;
  }

  const result = database
    .prepare(
      `INSERT INTO profiles (user_id, name, age, bio, interests, looking_for, values_json, sincerity, is_me)
       VALUES (@user_id, @name, @age, @bio, @interests, @looking_for, @values_json, @sincerity, 0)`
    )
    .run(payload);

  return getProfileById(Number(result.lastInsertRowid))!;
}

export function getUserCount(): number {
  return (getDb().prepare("SELECT COUNT(*) as c FROM users").get() as { c: number }).c;
}

export function updateProfilePhoto(userId: number, filename: string): Profile {
  getDb().prepare("UPDATE profiles SET photo_path = ? WHERE user_id = ?").run(filename, userId);
  return getProfileByUserId(userId)!;
}

// --- Likes ---

export function likeProfile(userId: number, profileId: number): boolean {
  const myProfile = getProfileByUserId(userId);
  if (!myProfile || myProfile.id === profileId) return false;
  if (!getProfileById(profileId)) return false;

  try {
    getDb()
      .prepare(`INSERT INTO likes (from_user_id, to_profile_id) VALUES (?, ?)`)
      .run(userId, profileId);
    return true;
  } catch {
    return false; // duplicate
  }
}

export function unlikeProfile(userId: number, profileId: number): void {
  getDb()
    .prepare(`DELETE FROM likes WHERE from_user_id = ? AND to_profile_id = ?`)
    .run(userId, profileId);
}

export function hasLiked(userId: number, profileId: number): boolean {
  const row = getDb()
    .prepare(`SELECT 1 FROM likes WHERE from_user_id = ? AND to_profile_id = ?`)
    .get(userId, profileId);
  return Boolean(row);
}

export function getLikedProfileIds(userId: number): number[] {
  return (
    getDb()
      .prepare(`SELECT to_profile_id FROM likes WHERE from_user_id = ? ORDER BY created_at DESC`)
      .all(userId) as { to_profile_id: number }[]
  ).map((r) => r.to_profile_id);
}

export function getMutualMatches(userId: number): {
  profile: Profile;
  liked_at: string;
  mutual_at: string;
}[] {
  const myProfile = getProfileByUserId(userId);
  if (!myProfile) return [];

  const rows = getDb()
    .prepare(
      `SELECT p.*, l1.created_at as liked_at, l2.created_at as mutual_at
       FROM likes l1
       JOIN profiles p ON p.id = l1.to_profile_id
       JOIN likes l2 ON l2.from_user_id = p.user_id AND l2.to_profile_id = ?
       WHERE l1.from_user_id = ? AND p.user_id IS NOT NULL
       ORDER BY l2.created_at DESC`
    )
    .all(myProfile.id, userId) as Record<string, unknown>[];

  return rows.map((row) => ({
    profile: parseProfile(row),
    liked_at: row.liked_at as string,
    mutual_at: row.mutual_at as string,
  }));
}

export function getLikesReceivedCount(profileId: number): number {
  return (
    getDb()
      .prepare(`SELECT COUNT(*) as c FROM likes WHERE to_profile_id = ?`)
      .get(profileId) as { c: number }
  ).c;
}
