import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import type { Category, CreateDealInput, Deal, SortOption } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "coupons.db");

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
      helpful_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE INDEX IF NOT EXISTS idx_deals_category ON deals(category);
    CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_deals_referrer_value ON deals(referrer_reward_value DESC);
    CREATE INDEX IF NOT EXISTS idx_deals_referee_value ON deals(referee_reward_value DESC);
  `);
}

export function getAllDeals(options?: {
  category?: Category;
  search?: string;
  sort?: SortOption;
}): Deal[] {
  const database = getDb();
  let sql = "SELECT * FROM deals WHERE 1=1";
  const params: (string | number)[] = [];

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
      sql +=
        " ORDER BY referrer_reward_value DESC NULLS LAST, created_at DESC";
      break;
    case "referee":
      sql += " ORDER BY referee_reward_value DESC NULLS LAST, created_at DESC";
      break;
    default:
      sql += " ORDER BY created_at DESC";
  }

  return database.prepare(sql).all(...params) as Deal[];
}

export function getDealById(id: number): Deal | undefined {
  const database = getDb();
  return database.prepare("SELECT * FROM deals WHERE id = ?").get(id) as
    | Deal
    | undefined;
}

export function createDeal(input: CreateDealInput): Deal {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO deals (
      service_name, referrer_reward, referee_reward,
      referrer_reward_value, referee_reward_value,
      referral_link, referral_code, conditions, description,
      category, expires_at, author_name
    )
    VALUES (
      @service_name, @referrer_reward, @referee_reward,
      @referrer_reward_value, @referee_reward_value,
      @referral_link, @referral_code, @conditions, @description,
      @category, @expires_at, @author_name
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
  });

  return getDealById(Number(result.lastInsertRowid))!;
}

export function incrementHelpful(id: number): Deal | undefined {
  const database = getDb();
  database
    .prepare("UPDATE deals SET helpful_count = helpful_count + 1 WHERE id = ?")
    .run(id);
  return getDealById(id);
}

export function getDealCount(): number {
  const database = getDb();
  const row = database
    .prepare("SELECT COUNT(*) as count FROM deals")
    .get() as { count: number };
  return row.count;
}

export function seedIfEmpty() {
  if (getDealCount() > 0) return;

  const samples: CreateDealInput[] = [
    {
      service_name: "PayPay",
      referrer_reward: "500円",
      referee_reward: "500円",
      referrer_reward_value: 500,
      referee_reward_value: 500,
      referral_link: "https://paypay.ne.jp/",
      conditions: "新規登録＋本人確認が必要。紹介者・被紹介者ともに条件達成で付与。",
      description: "決済アプリの定番紹介キャンペーン。友達招待で双方にポイント付与。",
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
      description: "フリマアプリの友達招待。コードをシェアするだけ。",
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
      conditions: "口座開設＋一定条件の達成が必要。キャンペーン時期により変動。",
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
      conditions: "新規入会＋利用条件あり。時期により金額変動。",
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
