import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { REPORT_HIDE_THRESHOLD } from "./constants-reports";
import { computeTotalScore, scoreToRank } from "./constants";
import { evaluatePrompt } from "./prompt-evaluator";
import { evaluatePromptWithLLM } from "./llm-evaluator";
import { checkAndIncrementLlmLimit } from "./rate-limit";
import type {
  AdminSubmission,
  AuthTokenType,
  Challenge,
  Comment,
  CreateChallengeInput,
  LeaderboardEntry,
  LeaderboardType,
  Report,
  ReportReason,
  Submission,
  User,
} from "./types";
import { MAX_COMMENT_DEPTH } from "./constants";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "prompt-dojo.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initSchema(db);
    migrateSchema(db);
  }
  return db;
}

function columnExists(database: Database.Database, table: string, column: string) {
  const columns = database
    .prepare(`PRAGMA table_info(${table})`)
    .all() as { name: string }[];
  return columns.some((c) => c.name === column);
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      display_name TEXT NOT NULL,
      session_token TEXT NOT NULL UNIQUE,
      oauth_provider TEXT,
      oauth_id TEXT,
      email TEXT UNIQUE,
      password_hash TEXT,
      email_verified INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      sample_output TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'active',
      author_id INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (author_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challenge_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      prompt_text TEXT NOT NULL,
      auto_score INTEGER NOT NULL,
      auto_feedback_json TEXT NOT NULL,
      llm_score INTEGER,
      llm_feedback_json TEXT,
      community_score REAL,
      rating_count INTEGER NOT NULL DEFAULT 0,
      report_count INTEGER NOT NULL DEFAULT 0,
      is_hidden INTEGER NOT NULL DEFAULT 0,
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

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      parent_id INTEGER,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (submission_id) REFERENCES submissions(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      reason TEXT NOT NULL,
      detail TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (submission_id) REFERENCES submissions(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE (submission_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      endpoint TEXT NOT NULL UNIQUE,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS auth_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL CHECK (type IN ('email_verify', 'password_reset')),
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_submissions_challenge ON submissions(challenge_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
    CREATE INDEX IF NOT EXISTS idx_ratings_submission ON ratings(submission_id);
    CREATE INDEX IF NOT EXISTS idx_comments_submission ON comments(submission_id);
    CREATE INDEX IF NOT EXISTS idx_reports_submission ON reports(submission_id);
    CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_auth_tokens_token ON auth_tokens(token);
    CREATE INDEX IF NOT EXISTS idx_auth_tokens_user ON auth_tokens(user_id);
  `);
}

function migrateSchema(database: Database.Database) {
  const migrations: [string, string, string][] = [
    ["challenges", "author_id", "ALTER TABLE challenges ADD COLUMN author_id INTEGER"],
    ["submissions", "llm_score", "ALTER TABLE submissions ADD COLUMN llm_score INTEGER"],
    ["submissions", "llm_feedback_json", "ALTER TABLE submissions ADD COLUMN llm_feedback_json TEXT"],
    ["submissions", "report_count", "ALTER TABLE submissions ADD COLUMN report_count INTEGER NOT NULL DEFAULT 0"],
    ["submissions", "is_hidden", "ALTER TABLE submissions ADD COLUMN is_hidden INTEGER NOT NULL DEFAULT 0"],
    ["users", "oauth_provider", "ALTER TABLE users ADD COLUMN oauth_provider TEXT"],
    ["users", "oauth_id", "ALTER TABLE users ADD COLUMN oauth_id TEXT"],
    ["users", "email", "ALTER TABLE users ADD COLUMN email TEXT"],
    ["users", "password_hash", "ALTER TABLE users ADD COLUMN password_hash TEXT"],
    ["users", "email_verified", "ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0"],
    ["comments", "parent_id", "ALTER TABLE comments ADD COLUMN parent_id INTEGER"],
  ];
  for (const [table, col, sql] of migrations) {
    if (!columnExists(database, table, col)) {
      database.exec(sql);
    }
  }

  database.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_oauth ON users(oauth_provider, oauth_id)
      WHERE oauth_provider IS NOT NULL AND oauth_id IS NOT NULL;

    CREATE TABLE IF NOT EXISTS llm_challenge_gen_usage (
      user_id INTEGER NOT NULL,
      usage_date TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (user_id, usage_date)
    );
  `);
}

function enrichSubmission(row: Submission, userId?: number | null): Submission {
  const evaluation = JSON.parse(row.auto_feedback_json);
  const total_score = computeTotalScore(row.auto_score, row.community_score);
  let user_rating: number | null = null;
  if (userId) {
    const rating = getDb()
      .prepare("SELECT stars FROM ratings WHERE submission_id = ? AND user_id = ?")
      .get(row.id, userId) as { stars: number } | undefined;
    user_rating = rating?.stars ?? null;
  }
  return { ...row, total_score, user_rating, rank: evaluation.rank };
}

export function seedIfEmpty() {
  const database = getDb();
  const count = (
    database.prepare("SELECT COUNT(*) as c FROM challenges").get() as { c: number }
  ).c;
  if (count > 0) return;

  const insert = database.prepare(
    `INSERT INTO challenges (title, description, sample_output, status, author_id)
     VALUES (?, ?, ?, 'active', NULL)`,
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

export function getUserById(id: number): User | null {
  return (
    (getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined) ??
    null
  );
}

export function getUserBySessionToken(token: string): User | null {
  return (
    (getDb()
      .prepare("SELECT * FROM users WHERE session_token = ?")
      .get(token) as User | undefined) ?? null
  );
}

export function getUserByOAuth(provider: string, oauthId: string): User | null {
  return (
    (getDb()
      .prepare("SELECT * FROM users WHERE oauth_provider = ? AND oauth_id = ?")
      .get(provider, oauthId) as User | undefined) ?? null
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
  return getUserById(Number(result.lastInsertRowid))!;
}

export function getUserByEmail(email: string): User | null {
  return (
    (getDb()
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email.toLowerCase()) as User | undefined) ?? null
  );
}

export function createUserWithEmail(
  email: string,
  passwordHash: string,
  displayName: string,
): User {
  const token = randomBytes(32).toString("hex");
  const database = getDb();
  const result = database
    .prepare(
      `INSERT INTO users (display_name, session_token, email, password_hash, email_verified)
       VALUES (?, ?, ?, ?, 0)`,
    )
    .run(displayName.trim(), token, email.toLowerCase(), passwordHash);
  return getUserById(Number(result.lastInsertRowid))!;
}

export function createAuthToken(
  userId: number,
  type: AuthTokenType,
  expiresHours: number,
): string {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + expiresHours * 60 * 60 * 1000).toISOString();

  getDb()
    .prepare("DELETE FROM auth_tokens WHERE user_id = ? AND type = ?")
    .run(userId, type);

  getDb()
    .prepare(
      "INSERT INTO auth_tokens (user_id, token, type, expires_at) VALUES (?, ?, ?, ?)",
    )
    .run(userId, token, type, expiresAt);

  return token;
}

export function consumeAuthToken(
  token: string,
  type: AuthTokenType,
): number | null {
  const row = getDb()
    .prepare("SELECT user_id, expires_at FROM auth_tokens WHERE token = ? AND type = ?")
    .get(token, type) as { user_id: number; expires_at: string } | undefined;

  if (!row) return null;

  getDb().prepare("DELETE FROM auth_tokens WHERE token = ?").run(token);

  if (new Date(row.expires_at) < new Date()) return null;

  return row.user_id;
}

export function markEmailVerified(userId: number): void {
  getDb()
    .prepare("UPDATE users SET email_verified = 1 WHERE id = ?")
    .run(userId);
}

export function updateUserPassword(userId: number, passwordHash: string): void {
  getDb()
    .prepare("UPDATE users SET password_hash = ? WHERE id = ?")
    .run(passwordHash, userId);
}

export function findOrCreateOAuthUser(
  provider: string,
  oauthId: string,
  displayName: string,
): User {
  const existing = getUserByOAuth(provider, oauthId);
  if (existing) return existing;

  const token = randomBytes(32).toString("hex");
  const database = getDb();
  const result = database
    .prepare(
      `INSERT INTO users (display_name, session_token, oauth_provider, oauth_id)
       VALUES (?, ?, ?, ?)`,
    )
    .run(displayName.trim(), token, provider, oauthId);
  return getUserById(Number(result.lastInsertRowid))!;
}

export function getAllChallenges(): Challenge[] {
  return getDb()
    .prepare(
      `SELECT c.*, COUNT(s.id) as submission_count
       FROM challenges c
       LEFT JOIN submissions s ON s.challenge_id = c.id AND s.is_hidden = 0
       WHERE c.status = 'active'
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
    )
    .all() as Challenge[];
}

export function getPendingChallenges(): Challenge[] {
  return getDb()
    .prepare(
      `SELECT c.*, u.display_name as author_name
       FROM challenges c
       LEFT JOIN users u ON u.id = c.author_id
       WHERE c.status = 'pending'
       ORDER BY c.created_at DESC`,
    )
    .all() as Challenge[];
}

export function getChallengeById(id: number, includePending = false): Challenge | null {
  const statusFilter = includePending
    ? "c.status IN ('active', 'pending', 'archived')"
    : "c.status = 'active'";
  return (
    (getDb()
      .prepare(
        `SELECT c.*, COUNT(s.id) as submission_count, u.display_name as author_name
         FROM challenges c
         LEFT JOIN submissions s ON s.challenge_id = c.id AND s.is_hidden = 0
         LEFT JOIN users u ON u.id = c.author_id
         WHERE c.id = ? AND ${statusFilter}
         GROUP BY c.id`,
      )
      .get(id) as Challenge | undefined) ?? null
  );
}

export function getChallengeByIdAdmin(id: number): Challenge | null {
  return (
    (getDb()
      .prepare(
        `SELECT c.*, u.display_name as author_name
         FROM challenges c
         LEFT JOIN users u ON u.id = c.author_id
         WHERE c.id = ?`,
      )
      .get(id) as Challenge | undefined) ?? null
  );
}

export function getAllChallengesAdmin(): Challenge[] {
  return getDb()
    .prepare(
      `SELECT c.*, u.display_name as author_name
       FROM challenges c
       LEFT JOIN users u ON u.id = c.author_id
       ORDER BY c.created_at DESC`,
    )
    .all() as Challenge[];
}

export function createChallenge(input: CreateChallengeInput): Challenge {
  const database = getDb();
  const result = database
    .prepare(
      `INSERT INTO challenges (title, description, sample_output, status, author_id)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(
      input.title,
      input.description,
      input.sample_output ?? "",
      input.status ?? "active",
      input.author_id ?? null,
    );
  return getChallengeByIdAdmin(Number(result.lastInsertRowid))!;
}

export function updateChallenge(
  id: number,
  input: Partial<CreateChallengeInput>,
): Challenge | null {
  const existing = getChallengeByIdAdmin(id);
  if (!existing) return null;
  getDb()
    .prepare(
      `UPDATE challenges SET title = ?, description = ?, sample_output = ?, status = ?, author_id = ? WHERE id = ?`,
    )
    .run(
      input.title ?? existing.title,
      input.description ?? existing.description,
      input.sample_output ?? existing.sample_output,
      input.status ?? existing.status,
      input.author_id !== undefined ? input.author_id : existing.author_id,
      id,
    );
  return getChallengeByIdAdmin(id);
}

export function approveChallenge(id: number): Challenge | null {
  const existing = getChallengeByIdAdmin(id);
  if (!existing || existing.status !== "pending") return null;
  return updateChallenge(id, { status: "active" });
}

export function deleteChallenge(id: number): boolean {
  const database = getDb();
  database
    .prepare(
      `DELETE FROM reports WHERE submission_id IN (SELECT id FROM submissions WHERE challenge_id = ?)`,
    )
    .run(id);
  database
    .prepare(
      `DELETE FROM comments WHERE submission_id IN (SELECT id FROM submissions WHERE challenge_id = ?)`,
    )
    .run(id);
  database
    .prepare(
      `DELETE FROM ratings WHERE submission_id IN (SELECT id FROM submissions WHERE challenge_id = ?)`,
    )
    .run(id);
  database.prepare("DELETE FROM submissions WHERE challenge_id = ?").run(id);
  const result = database.prepare("DELETE FROM challenges WHERE id = ?").run(id);
  return result.changes > 0;
}

export async function createSubmission(
  challengeId: number,
  userId: number,
  promptText: string,
): Promise<Submission> {
  const challenge = getChallengeById(challengeId);
  if (!challenge) throw new Error("課題が見つかりません");

  const evaluation = evaluatePrompt(promptText);
  let llmScore: number | null = null;
  let llmFeedback: string | null = null;

  const limit = checkAndIncrementLlmLimit(userId);
  if (limit.allowed) {
    const llmResult = await evaluatePromptWithLLM(challenge.description, promptText);
    if (llmResult) {
      llmScore = llmResult.score;
      llmFeedback = JSON.stringify(llmResult);
    }
  }

  const database = getDb();
  const result = database
    .prepare(
      `INSERT INTO submissions (challenge_id, user_id, prompt_text, auto_score, auto_feedback_json, llm_score, llm_feedback_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      challengeId,
      userId,
      promptText.trim(),
      evaluation.score,
      JSON.stringify(evaluation),
      llmScore,
      llmFeedback,
    );
  return getSubmissionById(Number(result.lastInsertRowid))!;
}

export function getSubmissionById(
  id: number,
  userId?: number | null,
  includeHidden = false,
): Submission | null {
  const hiddenFilter = includeHidden ? "" : "AND s.is_hidden = 0";
  const row = getDb()
    .prepare(
      `SELECT s.*, u.display_name as author_name, c.title as challenge_title
       FROM submissions s
       JOIN users u ON u.id = s.user_id
       JOIN challenges c ON c.id = s.challenge_id
       WHERE s.id = ? ${hiddenFilter}`,
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
       WHERE s.challenge_id = ? AND s.is_hidden = 0
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

export function getAllSubmissionsAdmin(): AdminSubmission[] {
  return getDb()
    .prepare(
      `SELECT s.*, u.display_name as author_name, c.title as challenge_title,
              (SELECT COUNT(*) FROM comments WHERE submission_id = s.id) as comment_count
       FROM submissions s
       JOIN users u ON u.id = s.user_id
       JOIN challenges c ON c.id = s.challenge_id
       ORDER BY s.created_at DESC`,
    )
    .all() as AdminSubmission[];
}

export function setSubmissionHidden(id: number, hidden: boolean): boolean {
  const result = getDb()
    .prepare("UPDATE submissions SET is_hidden = ? WHERE id = ?")
    .run(hidden ? 1 : 0, id);
  return result.changes > 0;
}

export function deleteSubmission(id: number): boolean {
  const database = getDb();
  database.prepare("DELETE FROM reports WHERE submission_id = ?").run(id);
  database.prepare("DELETE FROM comments WHERE submission_id = ?").run(id);
  database.prepare("DELETE FROM ratings WHERE submission_id = ?").run(id);
  const result = database.prepare("DELETE FROM submissions WHERE id = ?").run(id);
  return result.changes > 0;
}

export function rateSubmission(
  submissionId: number,
  userId: number,
  stars: number,
): { ok: boolean; error?: string; submission?: Submission } {
  const database = getDb();
  const submission = database
    .prepare("SELECT * FROM submissions WHERE id = ? AND is_hidden = 0")
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

export function getCommentsBySubmission(submissionId: number): Comment[] {
  const flat = getDb()
    .prepare(
      `SELECT c.*, u.display_name as author_name
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.submission_id = ?
       ORDER BY c.created_at ASC`,
    )
    .all(submissionId) as Comment[];

  return buildCommentTree(flat);
}

function buildCommentTree(flat: Comment[]): Comment[] {
  const byParent = new Map<number | null, Comment[]>();
  for (const comment of flat) {
    const key = comment.parent_id;
    const list = byParent.get(key) ?? [];
    list.push(comment);
    byParent.set(key, list);
  }

  function attachReplies(parentId: number | null): Comment[] {
    return (byParent.get(parentId) ?? []).map((comment) => ({
      ...comment,
      replies: attachReplies(comment.id),
    }));
  }

  return attachReplies(null);
}

function getCommentDepth(commentId: number, submissionId: number): number {
  let depth = 0;
  let currentId: number | null = commentId;

  while (currentId !== null) {
    depth += 1;
    const row = getDb()
      .prepare("SELECT parent_id FROM comments WHERE id = ? AND submission_id = ?")
      .get(currentId, submissionId) as { parent_id: number | null } | undefined;
    if (!row) return depth;
    currentId = row.parent_id;
  }

  return depth;
}

export function countComments(submissionId: number): number {
  return (
    getDb()
      .prepare("SELECT COUNT(*) as c FROM comments WHERE submission_id = ?")
      .get(submissionId) as { c: number }
  ).c;
}

export function getSubmissionOwnerId(submissionId: number): number | null {
  const row = getDb()
    .prepare("SELECT user_id FROM submissions WHERE id = ?")
    .get(submissionId) as { user_id: number } | undefined;
  return row?.user_id ?? null;
}

export function createComment(
  submissionId: number,
  userId: number,
  body: string,
  parentId?: number | null,
): Comment | null {
  const submission = getDb()
    .prepare("SELECT id FROM submissions WHERE id = ? AND is_hidden = 0")
    .get(submissionId);
  if (!submission) return null;

  if (parentId) {
    const parent = getDb()
      .prepare("SELECT id FROM comments WHERE id = ? AND submission_id = ?")
      .get(parentId, submissionId) as { id: number } | undefined;
    if (!parent) {
      return null;
    }

    const parentDepth = getCommentDepth(parentId, submissionId);
    if (parentDepth >= MAX_COMMENT_DEPTH) {
      return null;
    }
  }

  const result = getDb()
    .prepare(
      "INSERT INTO comments (submission_id, user_id, body, parent_id) VALUES (?, ?, ?, ?)",
    )
    .run(submissionId, userId, body.trim(), parentId ?? null);

  return getDb()
    .prepare(
      `SELECT c.*, u.display_name as author_name
       FROM comments c JOIN users u ON u.id = c.user_id WHERE c.id = ?`,
    )
    .get(result.lastInsertRowid) as Comment;
}

export function savePushSubscription(
  userId: number,
  endpoint: string,
  p256dh: string,
  authKey: string,
): void {
  getDb()
    .prepare(
      `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(endpoint) DO UPDATE SET user_id = excluded.user_id, p256dh = excluded.p256dh, auth = excluded.auth`,
    )
    .run(userId, endpoint, p256dh, authKey);
}

export function deletePushSubscription(userId: number, endpoint: string): void {
  getDb()
    .prepare("DELETE FROM push_subscriptions WHERE user_id = ? AND endpoint = ?")
    .run(userId, endpoint);
}

export function getPushSubscriptionsByUser(userId: number) {
  return getDb()
    .prepare("SELECT * FROM push_subscriptions WHERE user_id = ?")
    .all(userId) as { endpoint: string; p256dh: string; auth: string }[];
}

export function getChallengeAuthorId(challengeId: number): number | null {
  const row = getDb()
    .prepare("SELECT author_id FROM challenges WHERE id = ?")
    .get(challengeId) as { author_id: number | null } | undefined;
  return row?.author_id ?? null;
}

export function createReport(
  submissionId: number,
  userId: number,
  reason: ReportReason,
  detail: string,
): { hidden: boolean } | null {
  const database = getDb();
  const submission = database
    .prepare("SELECT * FROM submissions WHERE id = ?")
    .get(submissionId) as Submission | undefined;
  if (!submission) return null;
  if (submission.user_id === userId) return null;

  const existing = database
    .prepare("SELECT id FROM reports WHERE submission_id = ? AND user_id = ?")
    .get(submissionId, userId);
  if (existing) return { hidden: submission.is_hidden === 1 };

  database
    .prepare(
      "INSERT INTO reports (submission_id, user_id, reason, detail) VALUES (?, ?, ?, ?)",
    )
    .run(submissionId, userId, reason, detail.trim());

  const count = (
    database
      .prepare("SELECT COUNT(*) as c FROM reports WHERE submission_id = ?")
      .get(submissionId) as { c: number }
  ).c;

  database
    .prepare("UPDATE submissions SET report_count = ? WHERE id = ?")
    .run(count, submissionId);

  let hidden = false;
  if (count >= REPORT_HIDE_THRESHOLD) {
    database
      .prepare("UPDATE submissions SET is_hidden = 1 WHERE id = ?")
      .run(submissionId);
    hidden = true;
  }

  return { hidden };
}

export function getAllReports(): Report[] {
  return getDb()
    .prepare(
      `SELECT r.*, u.display_name as author_name,
              substr(s.prompt_text, 1, 80) as submission_preview
       FROM reports r
       JOIN users u ON u.id = r.user_id
       JOIN submissions s ON s.id = r.submission_id
       ORDER BY r.created_at DESC`,
    )
    .all() as Report[];
}

export function getLeaderboard(
  type: LeaderboardType = "total",
  limit = 50,
): LeaderboardEntry[] {
  const rows = getDb()
    .prepare(
      `SELECT s.id as submission_id, s.challenge_id, c.title as challenge_title,
              u.display_name as author_name, s.auto_score, s.llm_score,
              s.community_score, s.rating_count, s.created_at
       FROM submissions s
       JOIN challenges c ON c.id = s.challenge_id
       JOIN users u ON u.id = s.user_id
       WHERE c.status = 'active' AND s.is_hidden = 0`,
    )
    .all() as Omit<LeaderboardEntry, "total_score" | "rank">[];

  const entries: LeaderboardEntry[] = rows.map((row) => {
    const total_score = computeTotalScore(row.auto_score, row.community_score);
    return { ...row, total_score, rank: scoreToRank(total_score) };
  });

  entries.sort((a, b) => {
    if (type === "auto") return b.auto_score - a.auto_score;
    if (type === "llm") {
      const aScore = a.llm_score ?? 0;
      const bScore = b.llm_score ?? 0;
      return bScore - aScore;
    }
    if (type === "community") {
      const aScore = a.community_score ?? 0;
      const bScore = b.community_score ?? 0;
      return bScore - aScore || b.rating_count - a.rating_count;
    }
    return b.total_score - a.total_score || b.rating_count - a.rating_count;
  });

  return entries.slice(0, limit);
}
