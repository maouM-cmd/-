import { getDb } from "./db";

const DEFAULT_DAILY_LIMIT = Number(process.env.LLM_DAILY_LIMIT ?? 10);
const CHALLENGE_GEN_LIMIT = Number(process.env.LLM_CHALLENGE_GEN_LIMIT ?? 5);

function incrementUsage(
  table: string,
  userId: number,
  limit: number,
): { allowed: boolean; remaining: number } {
  const database = getDb();
  const today = new Date().toISOString().slice(0, 10);

  const row = database
    .prepare(`SELECT count FROM ${table} WHERE user_id = ? AND usage_date = ?`)
    .get(userId, today) as { count: number } | undefined;

  const current = row?.count ?? 0;
  if (current >= limit) {
    return { allowed: false, remaining: 0 };
  }

  if (row) {
    database
      .prepare(`UPDATE ${table} SET count = count + 1 WHERE user_id = ? AND usage_date = ?`)
      .run(userId, today);
  } else {
    database
      .prepare(`INSERT INTO ${table} (user_id, usage_date, count) VALUES (?, ?, 1)`)
      .run(userId, today);
  }

  return { allowed: true, remaining: limit - current - 1 };
}

export function checkAndIncrementLlmLimit(userId: number): {
  allowed: boolean;
  remaining: number;
} {
  const database = getDb();
  database.exec(`
    CREATE TABLE IF NOT EXISTS llm_usage (
      user_id INTEGER NOT NULL,
      usage_date TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (user_id, usage_date)
    )
  `);
  return incrementUsage("llm_usage", userId, DEFAULT_DAILY_LIMIT);
}

export function checkAndIncrementChallengeGenLimit(userId: number): {
  allowed: boolean;
  remaining: number;
} {
  const database = getDb();
  database.exec(`
    CREATE TABLE IF NOT EXISTS llm_challenge_gen_usage (
      user_id INTEGER NOT NULL,
      usage_date TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (user_id, usage_date)
    )
  `);
  return incrementUsage("llm_challenge_gen_usage", userId, CHALLENGE_GEN_LIMIT);
}
