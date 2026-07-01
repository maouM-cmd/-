import { getDb } from "./db";

const DEFAULT_DAILY_LIMIT = Number(process.env.LLM_DAILY_LIMIT ?? 10);

export function checkAndIncrementLlmLimit(userId: number): {
  allowed: boolean;
  remaining: number;
} {
  const database = getDb();
  const today = new Date().toISOString().slice(0, 10);

  database.exec(`
    CREATE TABLE IF NOT EXISTS llm_usage (
      user_id INTEGER NOT NULL,
      usage_date TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (user_id, usage_date)
    )
  `);

  const row = database
    .prepare(
      "SELECT count FROM llm_usage WHERE user_id = ? AND usage_date = ?",
    )
    .get(userId, today) as { count: number } | undefined;

  const current = row?.count ?? 0;
  if (current >= DEFAULT_DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  if (row) {
    database
      .prepare(
        "UPDATE llm_usage SET count = count + 1 WHERE user_id = ? AND usage_date = ?",
      )
      .run(userId, today);
  } else {
    database
      .prepare(
        "INSERT INTO llm_usage (user_id, usage_date, count) VALUES (?, ?, 1)",
      )
      .run(userId, today);
  }

  return { allowed: true, remaining: DEFAULT_DAILY_LIMIT - current - 1 };
}
