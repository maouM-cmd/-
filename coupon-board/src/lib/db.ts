import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import type { Category, Coupon, CreateCouponInput } from "./types";

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
    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_name TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      coupon_code TEXT,
      discount TEXT NOT NULL,
      url TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'other',
      expires_at TEXT,
      author_name TEXT NOT NULL DEFAULT '匿名',
      helpful_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE INDEX IF NOT EXISTS idx_coupons_category ON coupons(category);
    CREATE INDEX IF NOT EXISTS idx_coupons_created_at ON coupons(created_at DESC);
  `);
}

export function getAllCoupons(options?: {
  category?: Category;
  search?: string;
  sort?: "new" | "popular";
}): Coupon[] {
  const database = getDb();
  let sql = "SELECT * FROM coupons WHERE 1=1";
  const params: (string | number)[] = [];

  if (options?.category) {
    sql += " AND category = ?";
    params.push(options.category);
  }

  if (options?.search) {
    sql += " AND (service_name LIKE ? OR title LIKE ? OR description LIKE ? OR coupon_code LIKE ?)";
    const term = `%${options.search}%`;
    params.push(term, term, term, term);
  }

  if (options?.sort === "popular") {
    sql += " ORDER BY helpful_count DESC, created_at DESC";
  } else {
    sql += " ORDER BY created_at DESC";
  }

  return database.prepare(sql).all(...params) as Coupon[];
}

export function getCouponById(id: number): Coupon | undefined {
  const database = getDb();
  return database.prepare("SELECT * FROM coupons WHERE id = ?").get(id) as
    | Coupon
    | undefined;
}

export function createCoupon(input: CreateCouponInput): Coupon {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO coupons (service_name, title, description, coupon_code, discount, url, category, expires_at, author_name)
    VALUES (@service_name, @title, @description, @coupon_code, @discount, @url, @category, @expires_at, @author_name)
  `);

  const result = stmt.run({
    service_name: input.service_name.trim(),
    title: input.title.trim(),
    description: input.description.trim(),
    coupon_code: input.coupon_code?.trim() || null,
    discount: input.discount.trim(),
    url: input.url.trim(),
    category: input.category,
    expires_at: input.expires_at || null,
    author_name: input.author_name.trim() || "匿名",
  });

  return getCouponById(Number(result.lastInsertRowid))!;
}

export function incrementHelpful(id: number): Coupon | undefined {
  const database = getDb();
  database
    .prepare("UPDATE coupons SET helpful_count = helpful_count + 1 WHERE id = ?")
    .run(id);
  return getCouponById(id);
}

export function getCouponCount(): number {
  const database = getDb();
  const row = database
    .prepare("SELECT COUNT(*) as count FROM coupons")
    .get() as { count: number };
  return row.count;
}

export function seedIfEmpty() {
  if (getCouponCount() > 0) return;

  const samples: CreateCouponInput[] = [
    {
      service_name: "Uber Eats",
      title: "初回注文500円オフ",
      description:
        "アプリ初回注文で500円割引。配達料別途。友達紹介経由だとさらにお得な場合あり。",
      coupon_code: "初回特典は自動適用",
      discount: "500円OFF",
      url: "https://www.ubereats.com/jp",
      category: "food",
      author_name: "グルメ好き",
    },
    {
      service_name: "楽天市場",
      title: "新規会員登録クーポン",
      description:
        "楽天会員新規登録で利用できるクーポンが配布されることがあります。キャンペーンページを確認してください。",
      coupon_code: "キャンペーンにより異なる",
      discount: "最大1,000円OFF",
      url: "https://www.rakuten.co.jp",
      category: "ec",
      author_name: "お買い物マスター",
    },
    {
      service_name: "dポイントクラブ",
      title: "初回登録ボーナス",
      description: "dアカウント新規作成＋dポイントクラブ入会でポイントプレゼント。",
      coupon_code: undefined,
      discount: "300ポイント",
      url: "https://dpoint.docomo.ne.jp",
      category: "service",
      author_name: "ポイ活太郎",
    },
    {
      service_name: "Spotify",
      title: "Premium初回無料体験",
      description:
        "Spotify Premiumに初めて登録する方は、通常1〜3ヶ月の無料体験が利用できます（キャンペーン時期により変動）。",
      coupon_code: undefined,
      discount: "最大3ヶ月無料",
      url: "https://www.spotify.com/jp/premium",
      category: "subscription",
      expires_at: "2026-12-31",
      author_name: "音楽好き",
    },
    {
      service_name: "@cosme",
      title: "新規会員限定サンプル",
      description:
        "新規会員登録で人気コスメのサンプルやクーポンがもらえるキャンペーンを実施中のことがあります。",
      coupon_code: "会員登録後マイページで確認",
      discount: "サンプル＋500円OFF",
      url: "https://www.cosme.net",
      category: "beauty",
      author_name: "コスメレビュアー",
    },
  ];

  for (const sample of samples) {
    createCoupon(sample);
  }
}
