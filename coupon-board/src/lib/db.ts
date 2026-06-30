import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { REPORT_HIDE_THRESHOLD } from "./constants-reports";
import type {
  AdminDeal,
  Category,
  Comment,
  CreateDealInput,
  Deal,
  Report,
  ReportReason,
  SortOption,
  UsageType,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "coupons.db");

const EXPIRY_FILTER =
  "(expires_at IS NULL OR date(expires_at) >= date('now', 'localtime'))";

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

function columnExists(database: Database.Database, table: string, column: string) {
  const columns = database
    .prepare(`PRAGMA table_info(${table})`)
    .all() as { name: string }[];
  return columns.some((c) => c.name === column);
}

function migrateSchema(database: Database.Database) {
  const dealColumns: [string, string][] = [
    ["screenshot_path", "ALTER TABLE deals ADD COLUMN screenshot_path TEXT"],
    ["report_count", "ALTER TABLE deals ADD COLUMN report_count INTEGER NOT NULL DEFAULT 0"],
    ["is_hidden", "ALTER TABLE deals ADD COLUMN is_hidden INTEGER NOT NULL DEFAULT 0"],
    ["worked_count", "ALTER TABLE deals ADD COLUMN worked_count INTEGER NOT NULL DEFAULT 0"],
    ["failed_count", "ALTER TABLE deals ADD COLUMN failed_count INTEGER NOT NULL DEFAULT 0"],
  ];

  for (const [col, sql] of dealColumns) {
    if (!columnExists(database, "deals", col)) {
      database.exec(sql);
    }
  }
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS deals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_name TEXT NOT NULL,
      referrer_reward TEXT NOT NULL,
      referee_reward TEXT NOT NULL,
      referrer_reward_value INTEGER,
      referee_reward_value INTEGER,
      referral_link TEXT,
      referral_code TEXT,
      conditions TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'other',
      expires_at TEXT,
      author_name TEXT NOT NULL DEFAULT '匿名',
      screenshot_path TEXT,
      helpful_count INTEGER NOT NULL DEFAULT 0,
      worked_count INTEGER NOT NULL DEFAULT 0,
      failed_count INTEGER NOT NULL DEFAULT 0,
      report_count INTEGER NOT NULL DEFAULT 0,
      is_hidden INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deal_id INTEGER NOT NULL,
      reason TEXT NOT NULL,
      detail TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (deal_id) REFERENCES deals(id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deal_id INTEGER NOT NULL,
      author_name TEXT NOT NULL DEFAULT '匿名',
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (deal_id) REFERENCES deals(id)
    );

    CREATE INDEX IF NOT EXISTS idx_deals_category ON deals(category);
    CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_deals_referrer_value ON deals(referrer_reward_value DESC);
    CREATE INDEX IF NOT EXISTS idx_deals_referee_value ON deals(referee_reward_value DESC);
    CREATE INDEX IF NOT EXISTS idx_reports_deal_id ON reports(deal_id);
    CREATE INDEX IF NOT EXISTS idx_comments_deal_id ON comments(deal_id);
  `);

  migrateSchema(database);
}

function buildPublicDealFilter(includeExpired = false): string {
  let sql = "is_hidden = 0";
  if (!includeExpired) {
    sql += ` AND ${EXPIRY_FILTER}`;
  }
  return sql;
}

export function getAllDeals(options?: {
  category?: Category;
  search?: string;
  sort?: SortOption;
  ids?: number[];
}): Deal[] {
  const database = getDb();
  let sql = `SELECT * FROM deals WHERE ${buildPublicDealFilter()}`;
  const params: (string | number)[] = [];

  if (options?.ids?.length) {
    const placeholders = options.ids.map(() => "?").join(",");
    sql += ` AND id IN (${placeholders})`;
    params.push(...options.ids);
  }

  if (options?.category) {
    sql += " AND category = ?";
    params.push(options.category);
  }

  if (options?.search) {
    sql +=
      " AND (service_name LIKE ? OR referrer_reward LIKE ? OR referee_reward LIKE ? OR referral_code LIKE ? OR conditions LIKE ? OR description LIKE ?)";
    const term = `%${options.search}%`;
    params.push(term, term, term, term, term, term);
  }

  switch (options?.sort) {
    case "popular":
      sql += " ORDER BY helpful_count DESC, created_at DESC";
      break;
    case "referrer":
      sql += " ORDER BY referrer_reward_value DESC NULLS LAST, created_at DESC";
      break;
    case "referee":
      sql += " ORDER BY referee_reward_value DESC NULLS LAST, created_at DESC";
      break;
    default:
      sql += " ORDER BY created_at DESC";
  }

  return database.prepare(sql).all(...params) as Deal[];
}

export function getDealById(
  id: number,
  options?: { includeHidden?: boolean; includeExpired?: boolean }
): Deal | undefined {
  const database = getDb();
  const includeHidden = options?.includeHidden ?? false;
  const includeExpired = options?.includeExpired ?? false;

  let sql = "SELECT * FROM deals WHERE id = ?";
  if (!includeHidden) sql += " AND is_hidden = 0";
  if (!includeExpired) sql += ` AND ${EXPIRY_FILTER}`;

  return database.prepare(sql).get(id) as Deal | undefined;
}

export function getDealsByIds(ids: number[]): Deal[] {
  if (ids.length === 0) return [];
  return getAllDeals({ ids });
}

export function createDeal(input: CreateDealInput): Deal {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO deals (
      service_name, referrer_reward, referee_reward,
      referrer_reward_value, referee_reward_value,
      referral_link, referral_code, conditions, description,
      category, expires_at, author_name, screenshot_path
    )
    VALUES (
      @service_name, @referrer_reward, @referee_reward,
      @referrer_reward_value, @referee_reward_value,
      @referral_link, @referral_code, @conditions, @description,
      @category, @expires_at, @author_name, @screenshot_path
    )
  `);

  const result = stmt.run({
    service_name: input.service_name.trim(),
    referrer_reward: input.referrer_reward.trim(),
    referee_reward: input.referee_reward.trim(),
    referrer_reward_value: input.referrer_reward_value ?? null,
    referee_reward_value: input.referee_reward_value ?? null,
    referral_link: input.referral_link?.trim() || null,
    referral_code: input.referral_code?.trim() || null,
    conditions: input.conditions?.trim() ?? "",
    description: input.description?.trim() ?? "",
    category: input.category,
    expires_at: input.expires_at || null,
    author_name: input.author_name.trim() || "匿名",
    screenshot_path: input.screenshot_path ?? null,
  });

  return getDealById(Number(result.lastInsertRowid), {
    includeHidden: true,
    includeExpired: true,
  })!;
}

export function incrementHelpful(id: number): Deal | undefined {
  const database = getDb();
  database
    .prepare("UPDATE deals SET helpful_count = helpful_count + 1 WHERE id = ?")
    .run(id);
  return getDealById(id);
}

export function incrementUsage(id: number, type: UsageType): Deal | undefined {
  const database = getDb();
  const column = type === "worked" ? "worked_count" : "failed_count";
  database
    .prepare(`UPDATE deals SET ${column} = ${column} + 1 WHERE id = ?`)
    .run(id);
  return getDealById(id);
}

export function getCommentsByDealId(dealId: number): Comment[] {
  const database = getDb();
  return database
    .prepare(
      "SELECT * FROM comments WHERE deal_id = ? ORDER BY created_at ASC"
    )
    .all(dealId) as Comment[];
}

export function createComment(
  dealId: number,
  body: string,
  authorName?: string
): Comment | null {
  const database = getDb();
  const deal = database
    .prepare(`SELECT id FROM deals WHERE id = ? AND is_hidden = 0 AND ${EXPIRY_FILTER}`)
    .get(dealId);

  if (!deal) return null;

  const result = database
    .prepare(
      "INSERT INTO comments (deal_id, author_name, body) VALUES (@deal_id, @author_name, @body)"
    )
    .run({
      deal_id: dealId,
      author_name: authorName?.trim() || "匿名",
      body: body.trim(),
    });

  return database
    .prepare("SELECT * FROM comments WHERE id = ?")
    .get(result.lastInsertRowid) as Comment;
}

export function createReport(
  dealId: number,
  reason: ReportReason,
  detail?: string
): { report: Report; hidden: boolean } | null {
  const database = getDb();
  const deal = database
    .prepare("SELECT id FROM deals WHERE id = ?")
    .get(dealId) as { id: number } | undefined;

  if (!deal) return null;

  const insert = database.prepare(`
    INSERT INTO reports (deal_id, reason, detail)
    VALUES (@deal_id, @reason, @detail)
  `);

  const result = insert.run({
    deal_id: dealId,
    reason,
    detail: detail?.trim() ?? "",
  });

  database
    .prepare("UPDATE deals SET report_count = report_count + 1 WHERE id = ?")
    .run(dealId);

  const updated = database
    .prepare("SELECT report_count FROM deals WHERE id = ?")
    .get(dealId) as { report_count: number };

  let hidden = false;
  if (updated.report_count >= REPORT_HIDE_THRESHOLD) {
    database.prepare("UPDATE deals SET is_hidden = 1 WHERE id = ?").run(dealId);
    hidden = true;
  }

  const report = database
    .prepare("SELECT * FROM reports WHERE id = ?")
    .get(result.lastInsertRowid) as Report;

  return { report, hidden };
}

export function getAllDealsForAdmin(): AdminDeal[] {
  const database = getDb();
  return database
    .prepare(`
      SELECT d.*,
        (SELECT COUNT(*) FROM comments c WHERE c.deal_id = d.id) as comment_count
      FROM deals d
      ORDER BY d.is_hidden DESC, d.report_count DESC, d.created_at DESC
    `)
    .all() as AdminDeal[];
}

export function getAllReports(): (Report & { service_name: string })[] {
  const database = getDb();
  return database
    .prepare(`
      SELECT r.*, d.service_name
      FROM reports r
      JOIN deals d ON d.id = r.deal_id
      ORDER BY r.created_at DESC
      LIMIT 100
    `)
    .all() as (Report & { service_name: string })[];
}

export function setDealHidden(id: number, hidden: boolean): boolean {
  const database = getDb();
  const result = database
    .prepare("UPDATE deals SET is_hidden = ? WHERE id = ?")
    .run(hidden ? 1 : 0, id);
  return result.changes > 0;
}

export function deleteDeal(id: number): boolean {
  const database = getDb();
  database.prepare("DELETE FROM comments WHERE deal_id = ?").run(id);
  database.prepare("DELETE FROM reports WHERE deal_id = ?").run(id);
  const result = database.prepare("DELETE FROM deals WHERE id = ?").run(id);
  return result.changes > 0;
}

export function getDealCount(): number {
  const database = getDb();
  const row = database
    .prepare(`SELECT COUNT(*) as count FROM deals WHERE ${buildPublicDealFilter()}`)
    .get() as { count: number };
  return row.count;
}

export function seedIfEmpty() {
  const database = getDb();
  const total = database
    .prepare("SELECT COUNT(*) as count FROM deals")
    .get() as { count: number };
  if (total.count > 0) return;

  const samples: CreateDealInput[] = [
    {
      service_name: "PayPay",
      referrer_reward: "500円",
      referee_reward: "500円",
      referrer_reward_value: 500,
      referee_reward_value: 500,
      referral_link: "https://paypay.ne.jp/",
      conditions: "新規登録＋本人確認が必要。",
      description: "決済アプリの定番紹介キャンペーン。",
      category: "payment",
      author_name: "ペイペイ太郎",
    },
    {
      service_name: "メルカリ",
      referrer_reward: "500円分",
      referee_reward: "500円分",
      referrer_reward_value: 500,
      referee_reward_value: 500,
      referral_code: "アプリ内の招待コード",
      conditions: "初めての出品または購入完了が条件。",
      category: "ec",
      author_name: "メルカリ大好き",
    },
    {
      service_name: "SBI証券",
      referrer_reward: "2,000円",
      referee_reward: "1,000円",
      referrer_reward_value: 2000,
      referee_reward_value: 1000,
      referral_link: "https://www.sbisec.co.jp/",
      conditions: "口座開設＋一定条件の達成が必要。",
      category: "finance",
      author_name: "投資初心者",
    },
    {
      service_name: "楽天カード",
      referrer_reward: "3,000ポイント",
      referee_reward: "5,000ポイント",
      referrer_reward_value: 3000,
      referee_reward_value: 5000,
      referral_link: "https://www.rakuten-card.co.jp/",
      conditions: "新規入会＋利用条件あり。",
      category: "finance",
      author_name: "ポイ活マスター",
    },
    {
      service_name: "Uber Eats",
      referrer_reward: "1,000円クーポン",
      referee_reward: "1,000円クーポン",
      referrer_reward_value: 1000,
      referee_reward_value: 1000,
      referral_link: "https://www.ubereats.com/jp",
      conditions: "招待経由の初回注文で双方にクーポン付与。",
      category: "ec",
      author_name: "グルメ好き",
    },
  ];

  for (const sample of samples) {
    createDeal(sample);
  }
}
