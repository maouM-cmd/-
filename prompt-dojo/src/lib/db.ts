import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { computeTotalScore, scoreToRank } from "./constants";
import { evaluatePrompt } from "./prompt-evaluator";
import type {
  Challenge,
  CreateChallengeInput,
  LeaderboardEntry,
  LeaderboardType,
  Submission,
  User,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "prompt-dojo.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initSchema(db);
  }
  return db;
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      display_name TEXT NOT NULL,
      session_token TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      sample_output TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challenge_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      prompt_text TEXT NOT NULL,
      auto_score INTEGER NOT NULL,
      auto_feedback_json TEXT NOT NULL,
      community_score REAL,
      rating_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (challenge_id) REFERENCES challenges(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (submission_id) REFERENCES submissions(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE (submission_id, user_id)
    );

    CREATE INDEX IF NOT EXISTS idx_submissions_challenge ON submissions(challenge_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
    CREATE INDEX IF NOT EXISTS idx_ratings_submission ON ratings(submission_id);
  `);
}

function enrichSubmission(
  row: Submission,
  userId?: number | null,
): Submission {
  const evaluation = JSON.parse(row.auto_feedback_json);
  const total_score = computeTotalScore(row.auto_score, row.community_score);
  let user_rating: number | null = null;
  if (userId) {
    const rating = getDb()
      .prepare("SELECT stars FROM ratings WHERE submission_id = ? AND user_id = ?")
      .get(row.id, userId) as { stars: number } | undefined;
    user_rating = rating?.stars ?? null;
  }
  return {
    ...row,
    total_score,
    user_rating,
    rank: evaluation.rank,
  } as Submission & { rank?: string };
}

export function seedIfEmpty() {
  const database = getDb();
  const count = (
    database.prepare("SELECT COUNT(*) as c FROM challenges").get() as { c: number }
  ).c;
  if (count > 0) return;

  const insert = database.prepare(
    `INSERT INTO challenges (title, description, sample_output, status)
     VALUES (?, ?, ?, 'active')`,
  );

  insert.run(
    "SNS投稿文を3パターン作成",
    "20代女性向けのカフェ紹介SNS投稿を作成するプロンプトを書いてください。マーケターの視点で、絵文字の使用や文字数制限も含めて指示しましょう。",
    "例: 3パターンの投稿文（各100字以内、絵文字多め、ハッシュタグ付き）",
  );
  insert.run(
    "会議議事録を要約",
    "長い会議の議事録テキストを、要点だけ箇条書きで要約させるプロンプトを書いてください。出力形式と含めるべき項目を明確にしましょう。",
    "例: 決定事項・TODO・論点の3セクションで箇条書き要約",
  );
  insert.run(
    "英語メールの翻訳・トーン調整",
    "カジュアルな英語メールを、ビジネス向けの丁寧な日本語に翻訳・調整するプロンプトを書いてください。制約条件（敬語レベル、禁止表現など）も含めましょう。",
    "例: ビジネス敬語の日本語メール（カジュアル表現禁止、200字以内）",
  );
}

export function getUserBySessionToken(token: string): User | null {
  return (
    (getDb()
      .prepare("SELECT * FROM users WHERE session_token = ?")
      .get(token) as User | undefined) ?? null
  );
}

export function findOrCreateUser(token: string, displayName: string): User {
  const database = getDb();
  const existing = getUserBySessionToken(token);
  if (existing) {
    if (existing.display_name !== displayName.trim()) {
      database
        .prepare("UPDATE users SET display_name = ? WHERE id = ?")
        .run(displayName.trim(), existing.id);
      return { ...existing, display_name: displayName.trim() };
    }
    return existing;
  }
  const result = database
    .prepare("INSERT INTO users (display_name, session_token) VALUES (?, ?)")
    .run(displayName.trim(), token);
  return database
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(result.lastInsertRowid) as User;
}

export function getAllChallenges(): Challenge[] {
  return getDb()
    .prepare(
      `SELECT c.*, COUNT(s.id) as submission_count
       FROM challenges c
       LEFT JOIN submissions s ON s.challenge_id = c.id
       WHERE c.status = 'active'
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
    )
    .all() as Challenge[];
}

export function getChallengeById(id: number): Challenge | null {
  return (
    (getDb()
      .prepare(
        `SELECT c.*, COUNT(s.id) as submission_count
         FROM challenges c
         LEFT JOIN submissions s ON s.challenge_id = c.id
         WHERE c.id = ?
         GROUP BY c.id`,
      )
      .get(id) as Challenge | undefined) ?? null
  );
}

export function getAllChallengesAdmin(): Challenge[] {
  return getDb()
    .prepare("SELECT * FROM challenges ORDER BY created_at DESC")
    .all() as Challenge[];
}

export function createChallenge(input: CreateChallengeInput): Challenge {
  const database = getDb();
  const result = database
    .prepare(
      `INSERT INTO challenges (title, description, sample_output, status)
       VALUES (?, ?, ?, ?)`,
    )
    .run(
      input.title,
      input.description,
      input.sample_output ?? "",
      input.status ?? "active",
    );
  return getChallengeById(Number(result.lastInsertRowid))!;
}

export function updateChallenge(
  id: number,
  input: Partial<CreateChallengeInput>,
): Challenge | null {
  const existing = getChallengeById(id);
  if (!existing) return null;
  getDb()
    .prepare(
      `UPDATE challenges SET title = ?, description = ?, sample_output = ?, status = ? WHERE id = ?`,
    )
    .run(
      input.title ?? existing.title,
      input.description ?? existing.description,
      input.sample_output ?? existing.sample_output,
      input.status ?? existing.status,
      id,
    );
  return getChallengeById(id);
}

export function deleteChallenge(id: number): boolean {
  const database = getDb();
  database
    .prepare(
      `DELETE FROM ratings WHERE submission_id IN (SELECT id FROM submissions WHERE challenge_id = ?)`,
    )
    .run(id);
  database.prepare("DELETE FROM submissions WHERE challenge_id = ?").run(id);
  const result = database.prepare("DELETE FROM challenges WHERE id = ?").run(id);
  return result.changes > 0;
}

export function createSubmission(
  challengeId: number,
  userId: number,
  promptText: string,
): Submission {
  const evaluation = evaluatePrompt(promptText);
  const database = getDb();
  const result = database
    .prepare(
      `INSERT INTO submissions (challenge_id, user_id, prompt_text, auto_score, auto_feedback_json)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(
      challengeId,
      userId,
      promptText.trim(),
      evaluation.score,
      JSON.stringify(evaluation),
    );
  return getSubmissionById(Number(result.lastInsertRowid))!;
}

export function getSubmissionById(
  id: number,
  userId?: number | null,
): Submission | null {
  const row = getDb()
    .prepare(
      `SELECT s.*, u.display_name as author_name, c.title as challenge_title
       FROM submissions s
       JOIN users u ON u.id = s.user_id
       JOIN challenges c ON c.id = s.challenge_id
       WHERE s.id = ?`,
    )
    .get(id) as Submission | undefined;
  if (!row) return null;
  return enrichSubmission(row, userId);
}

export function getSubmissionsByChallenge(
  challengeId: number,
  userId?: number | null,
): Submission[] {
  const rows = getDb()
    .prepare(
      `SELECT s.*, u.display_name as author_name
       FROM submissions s
       JOIN users u ON u.id = s.user_id
       WHERE s.challenge_id = ?
       ORDER BY s.created_at DESC`,
    )
    .all(challengeId) as Submission[];
  return rows.map((r) => enrichSubmission(r, userId));
}

export function getUserSubmissions(userId: number): Submission[] {
  const rows = getDb()
    .prepare(
      `SELECT s.*, c.title as challenge_title
       FROM submissions s
       JOIN challenges c ON c.id = s.challenge_id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC`,
    )
    .all(userId) as Submission[];
  return rows.map((r) => enrichSubmission(r, userId));
}

export function rateSubmission(
  submissionId: number,
  userId: number,
  stars: number,
): { ok: boolean; error?: string; submission?: Submission } {
  const database = getDb();
  const submission = database
    .prepare("SELECT * FROM submissions WHERE id = ?")
    .get(submissionId) as Submission | undefined;
  if (!submission) return { ok: false, error: "投稿が見つかりません" };
  if (submission.user_id === userId) {
    return { ok: false, error: "自分の投稿は評価できません" };
  }
  if (stars < 1 || stars > 5) {
    return { ok: false, error: "評価は1〜5の星で行ってください" };
  }

  const existing = database
    .prepare("SELECT id FROM ratings WHERE submission_id = ? AND user_id = ?")
    .get(submissionId, userId);
  if (existing) {
    database
      .prepare("UPDATE ratings SET stars = ? WHERE submission_id = ? AND user_id = ?")
      .run(stars, submissionId, userId);
  } else {
    database
      .prepare("INSERT INTO ratings (submission_id, user_id, stars) VALUES (?, ?, ?)")
      .run(submissionId, userId, stars);
  }

  const agg = database
    .prepare(
      `SELECT AVG(stars) as avg_stars, COUNT(*) as cnt FROM ratings WHERE submission_id = ?`,
    )
    .get(submissionId) as { avg_stars: number; cnt: number };

  database
    .prepare(
      "UPDATE submissions SET community_score = ?, rating_count = ? WHERE id = ?",
    )
    .run(agg.avg_stars, agg.cnt, submissionId);

  return { ok: true, submission: getSubmissionById(submissionId, userId)! };
}

export function getLeaderboard(
  type: LeaderboardType = "total",
  limit = 50,
): LeaderboardEntry[] {
  const rows = getDb()
    .prepare(
      `SELECT s.id as submission_id, s.challenge_id, c.title as challenge_title,
              u.display_name as author_name, s.auto_score, s.community_score,
              s.rating_count, s.created_at
       FROM submissions s
       JOIN challenges c ON c.id = s.challenge_id
       JOIN users u ON u.id = s.user_id
       WHERE c.status = 'active'`,
    )
    .all() as Omit<LeaderboardEntry, "total_score" | "rank">[];

  const entries: LeaderboardEntry[] = rows.map((row) => {
    const total_score = computeTotalScore(row.auto_score, row.community_score);
    return {
      ...row,
      total_score,
      rank: scoreToRank(total_score),
    };
  });

  entries.sort((a, b) => {
    if (type === "auto") return b.auto_score - a.auto_score;
    if (type === "community") {
      const aScore = a.community_score ?? 0;
      const bScore = b.community_score ?? 0;
      return bScore - aScore || b.rating_count - a.rating_count;
    }
    return b.total_score - a.total_score || b.rating_count - a.rating_count;
  });

  return entries.slice(0, limit);
}
