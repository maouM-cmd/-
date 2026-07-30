import Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ApiErrorCode } from "./api-errors";

function createTestDb(): Database.Database {
  const db = new Database(":memory:");
  db.exec(`
    CREATE TABLE submissions (
      id INTEGER PRIMARY KEY,
      challenge_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      prompt_text TEXT NOT NULL,
      auto_score INTEGER NOT NULL DEFAULT 0,
      auto_feedback_json TEXT NOT NULL DEFAULT '{}',
      llm_score INTEGER,
      llm_feedback_json TEXT,
      community_score REAL,
      rating_count INTEGER NOT NULL DEFAULT 0,
      report_count INTEGER NOT NULL DEFAULT 0,
      is_hidden INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT '2026-01-01'
    );
    CREATE TABLE ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      stars INTEGER NOT NULL
    );
    INSERT INTO submissions (id, challenge_id, user_id, prompt_text, auto_score)
    VALUES (1, 1, 1, 'test prompt', 80);
  `);
  return db;
}

function rateSubmissionInDb(
  db: Database.Database,
  submissionId: number,
  userId: number,
  stars: number,
): { ok: boolean; error?: string } {
  const submission = db
    .prepare("SELECT * FROM submissions WHERE id = ? AND is_hidden = 0")
    .get(submissionId) as { user_id: number } | undefined;
  if (!submission) return { ok: false, error: ApiErrorCode.SUBMISSION_NOT_FOUND };
  if (submission.user_id === userId) return { ok: false, error: ApiErrorCode.CANNOT_RATE_OWN };
  if (stars < 1 || stars > 5) return { ok: false, error: ApiErrorCode.INVALID_RATING };
  return { ok: true };
}

describe("rateSubmission error codes", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it("returns SUBMISSION_NOT_FOUND for missing submission", () => {
    const result = rateSubmissionInDb(db, 999, 2, 5);
    expect(result.ok).toBe(false);
    expect(result.error).toBe("SUBMISSION_NOT_FOUND");
  });

  it("returns CANNOT_RATE_OWN when rating own submission", () => {
    const result = rateSubmissionInDb(db, 1, 1, 5);
    expect(result.ok).toBe(false);
    expect(result.error).toBe("CANNOT_RATE_OWN");
  });

  it("returns INVALID_RATING for out-of-range stars", () => {
    const result = rateSubmissionInDb(db, 1, 2, 0);
    expect(result.ok).toBe(false);
    expect(result.error).toBe("INVALID_RATING");
  });

  it("succeeds for valid rating", () => {
    const result = rateSubmissionInDb(db, 1, 2, 4);
    expect(result.ok).toBe(true);
  });
});
