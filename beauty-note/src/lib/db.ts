import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { DEFAULT_CHEER_MESSAGE, DEFAULT_PIN_LIMIT } from "./ingredients";
import type {
  AppSettings,
  CreateProductInput,
  CreateShiftLogInput,
  IngredientFaq,
  Product,
  ShiftLog,
  StudyLog,
  UpdateProductInput,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "beauty-note.db");

let db: Database.Database | null = null;

type ProductRow = {
  id: number;
  brand: string;
  name: string;
  shade: string;
  category: Product["category"];
  key_ingredients: string;
  ingredient_tags: string;
  skin_types: string;
  avoid_for: string;
  talking_points: string;
  notes: string;
  is_pinned: number;
  study_progress: number;
  created_at: string;
  updated_at: string;
};

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
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      name TEXT NOT NULL,
      shade TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'other',
      key_ingredients TEXT NOT NULL DEFAULT '[]',
      ingredient_tags TEXT NOT NULL DEFAULT '[]',
      skin_types TEXT NOT NULL DEFAULT '[]',
      avoid_for TEXT NOT NULL DEFAULT '',
      talking_points TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      is_pinned INTEGER NOT NULL DEFAULT 0,
      study_progress INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS ingredient_faq (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS study_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      studied_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      score INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS shift_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      learned_note TEXT NOT NULL DEFAULT '',
      struggled_ingredient TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_products_pinned ON products(is_pinned DESC, updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_study_log_product ON study_log(product_id);
  `);
}

function parseJsonArray<T>(value: string, fallback: T[] = []): T[] {
  try {
    const parsed = JSON.parse(value) as T[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    brand: row.brand,
    name: row.name,
    shade: row.shade,
    category: row.category,
    key_ingredients: parseJsonArray<string>(row.key_ingredients),
    ingredient_tags: parseJsonArray(row.ingredient_tags),
    skin_types: parseJsonArray(row.skin_types),
    avoid_for: row.avoid_for,
    talking_points: row.talking_points,
    notes: row.notes,
    is_pinned: row.is_pinned === 1,
    study_progress: row.study_progress,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function getSetting(key: string, fallback = ""): string {
  const database = getDb();
  const row = database
    .prepare("SELECT value FROM settings WHERE key = ?")
    .get(key) as { value: string } | undefined;
  return row?.value ?? fallback;
}

function setSetting(key: string, value: string) {
  const database = getDb();
  database
    .prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
    )
    .run(key, value);
}

export function getSettings(): AppSettings {
  return {
    staff_name: getSetting("staff_name", ""),
    shop_name: getSetting("shop_name", ""),
    pin_limit: Number(getSetting("pin_limit", String(DEFAULT_PIN_LIMIT))),
    cheer_message: getSetting("cheer_message", ""),
    welcome_seen: getSetting("welcome_seen", "0") === "1",
  };
}

export function updateSettings(
  input: Partial<AppSettings>
): AppSettings {
  if (input.staff_name !== undefined) setSetting("staff_name", input.staff_name);
  if (input.shop_name !== undefined) setSetting("shop_name", input.shop_name);
  if (input.pin_limit !== undefined)
    setSetting("pin_limit", String(input.pin_limit));
  if (input.cheer_message !== undefined)
    setSetting("cheer_message", input.cheer_message);
  if (input.welcome_seen !== undefined)
    setSetting("welcome_seen", input.welcome_seen ? "1" : "0");
  return getSettings();
}

export function getAllProducts(options?: {
  pinnedOnly?: boolean;
  search?: string;
  category?: Product["category"];
}): Product[] {
  const database = getDb();
  let sql = "SELECT * FROM products WHERE 1=1";
  const params: (string | number)[] = [];

  if (options?.pinnedOnly) {
    sql += " AND is_pinned = 1";
  }
  if (options?.category) {
    sql += " AND category = ?";
    params.push(options.category);
  }
  if (options?.search) {
    sql +=
      " AND (brand LIKE ? OR name LIKE ? OR shade LIKE ? OR talking_points LIKE ? OR notes LIKE ? OR key_ingredients LIKE ?)";
    const term = `%${options.search}%`;
    params.push(term, term, term, term, term, term);
  }

  sql += " ORDER BY is_pinned DESC, study_progress ASC, updated_at DESC";

  const rows = database.prepare(sql).all(...params) as ProductRow[];
  return rows.map(rowToProduct);
}

export function getPinnedProducts(): Product[] {
  const database = getDb();
  const limit = getSettings().pin_limit || DEFAULT_PIN_LIMIT;
  const rows = database
    .prepare(
      `SELECT * FROM products WHERE is_pinned = 1 ORDER BY study_progress ASC, updated_at DESC LIMIT ?`
    )
    .all(limit) as ProductRow[];
  return rows.map(rowToProduct);
}

export function getProductById(id: number): Product | undefined {
  const database = getDb();
  const row = database
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(id) as ProductRow | undefined;
  return row ? rowToProduct(row) : undefined;
}

export function getPinnedCount(): number {
  const database = getDb();
  const row = database
    .prepare("SELECT COUNT(*) as count FROM products WHERE is_pinned = 1")
    .get() as { count: number };
  return row.count;
}

export function createProduct(input: CreateProductInput): Product {
  const database = getDb();
  if (input.is_pinned) {
    const limit = getSettings().pin_limit || DEFAULT_PIN_LIMIT;
    if (getPinnedCount() >= limit) {
      throw new Error(`ピン留めは最大${limit}件までです`);
    }
  }

  const result = database
    .prepare(
      `INSERT INTO products (
        brand, name, shade, category, key_ingredients, ingredient_tags,
        skin_types, avoid_for, talking_points, notes, is_pinned
      ) VALUES (
        @brand, @name, @shade, @category, @key_ingredients, @ingredient_tags,
        @skin_types, @avoid_for, @talking_points, @notes, @is_pinned
      )`
    )
    .run({
      brand: input.brand.trim(),
      name: input.name.trim(),
      shade: input.shade?.trim() ?? "",
      category: input.category,
      key_ingredients: JSON.stringify(input.key_ingredients ?? []),
      ingredient_tags: JSON.stringify(input.ingredient_tags ?? []),
      skin_types: JSON.stringify(input.skin_types ?? []),
      avoid_for: input.avoid_for?.trim() ?? "",
      talking_points: input.talking_points?.trim() ?? "",
      notes: input.notes?.trim() ?? "",
      is_pinned: input.is_pinned ? 1 : 0,
    });

  return getProductById(Number(result.lastInsertRowid))!;
}

export function updateProduct(
  id: number,
  input: UpdateProductInput
): Product | null {
  const database = getDb();
  const existing = getProductById(id);
  if (!existing) return null;

  if (input.is_pinned === true && !existing.is_pinned) {
    const limit = getSettings().pin_limit || DEFAULT_PIN_LIMIT;
    if (getPinnedCount() >= limit) {
      throw new Error(`ピン留めは最大${limit}件までです`);
    }
  }

  const next = {
    brand: input.brand?.trim() ?? existing.brand,
    name: input.name?.trim() ?? existing.name,
    shade: input.shade?.trim() ?? existing.shade,
    category: input.category ?? existing.category,
    key_ingredients: JSON.stringify(
      input.key_ingredients ?? existing.key_ingredients
    ),
    ingredient_tags: JSON.stringify(
      input.ingredient_tags ?? existing.ingredient_tags
    ),
    skin_types: JSON.stringify(input.skin_types ?? existing.skin_types),
    avoid_for: input.avoid_for?.trim() ?? existing.avoid_for,
    talking_points: input.talking_points?.trim() ?? existing.talking_points,
    notes: input.notes?.trim() ?? existing.notes,
    is_pinned:
      input.is_pinned !== undefined
        ? input.is_pinned
          ? 1
          : 0
        : existing.is_pinned
          ? 1
          : 0,
    study_progress: input.study_progress ?? existing.study_progress,
  };

  database
    .prepare(
      `UPDATE products SET
        brand = @brand, name = @name, shade = @shade, category = @category,
        key_ingredients = @key_ingredients, ingredient_tags = @ingredient_tags,
        skin_types = @skin_types, avoid_for = @avoid_for,
        talking_points = @talking_points, notes = @notes,
        is_pinned = @is_pinned, study_progress = @study_progress,
        updated_at = datetime('now', 'localtime')
      WHERE id = @id`
    )
    .run({ ...next, id });

  return getProductById(id) ?? null;
}

export function deleteProduct(id: number): boolean {
  const database = getDb();
  const result = database.prepare("DELETE FROM products WHERE id = ?").run(id);
  return result.changes > 0;
}

export function togglePin(id: number): Product | null {
  const product = getProductById(id);
  if (!product) return null;
  return updateProduct(id, { is_pinned: !product.is_pinned });
}

export function recordStudy(
  productId: number,
  remembered: boolean
): Product | null {
  const database = getDb();
  const product = getProductById(productId);
  if (!product) return null;

  const delta = remembered ? 15 : -5;
  const study_progress = Math.max(
    0,
    Math.min(100, product.study_progress + delta)
  );

  database
    .prepare(
      "INSERT INTO study_log (product_id, score) VALUES (?, ?)"
    )
    .run(productId, remembered ? 100 : 0);

  return updateProduct(productId, { study_progress });
}

export function getStudyStats(): {
  pinnedCount: number;
  studiedToday: number;
  averageProgress: number;
} {
  const database = getDb();
  const pinned = getPinnedProducts();
  const studiedTodayRow = database
    .prepare(
      `SELECT COUNT(DISTINCT product_id) as count FROM study_log
       WHERE date(studied_at) = date('now', 'localtime')`
    )
    .get() as { count: number };

  const averageProgress =
    pinned.length === 0
      ? 0
      : Math.round(
          pinned.reduce((sum, p) => sum + p.study_progress, 0) / pinned.length
        );

  return {
    pinnedCount: pinned.length,
    studiedToday: studiedTodayRow.count,
    averageProgress,
  };
}

export function getRecentStudyLogs(limit = 20): StudyLog[] {
  const database = getDb();
  return database
    .prepare(
      "SELECT * FROM study_log ORDER BY studied_at DESC LIMIT ?"
    )
    .all(limit) as StudyLog[];
}

export function getAllFaq(): IngredientFaq[] {
  const database = getDb();
  return database
    .prepare("SELECT * FROM ingredient_faq ORDER BY sort_order ASC, id ASC")
    .all() as IngredientFaq[];
}

export function createFaq(
  question: string,
  answer: string,
  sort_order?: number
): IngredientFaq {
  const database = getDb();
  const maxOrder = database
    .prepare("SELECT COALESCE(MAX(sort_order), 0) as max FROM ingredient_faq")
    .get() as { max: number };

  const result = database
    .prepare(
      "INSERT INTO ingredient_faq (question, answer, sort_order) VALUES (?, ?, ?)"
    )
    .run(
      question.trim(),
      answer.trim(),
      sort_order ?? maxOrder.max + 1
    );

  return database
    .prepare("SELECT * FROM ingredient_faq WHERE id = ?")
    .get(result.lastInsertRowid) as IngredientFaq;
}

export function getShiftLogs(limit = 30): (ShiftLog & {
  product_name?: string;
  brand?: string;
})[] {
  const database = getDb();
  return database
    .prepare(
      `SELECT s.*, p.name as product_name, p.brand as brand
       FROM shift_log s
       LEFT JOIN products p ON p.id = s.product_id
       ORDER BY s.created_at DESC
       LIMIT ?`
    )
    .all(limit) as (ShiftLog & { product_name?: string; brand?: string })[];
}

export function createShiftLog(input: CreateShiftLogInput): ShiftLog {
  const database = getDb();
  const result = database
    .prepare(
      `INSERT INTO shift_log (product_id, learned_note, struggled_ingredient)
       VALUES (@product_id, @learned_note, @struggled_ingredient)`
    )
    .run({
      product_id: input.product_id ?? null,
      learned_note: input.learned_note?.trim() ?? "",
      struggled_ingredient: input.struggled_ingredient?.trim() ?? "",
    });

  return database
    .prepare("SELECT * FROM shift_log WHERE id = ?")
    .get(result.lastInsertRowid) as ShiftLog;
}

export function exportAllData() {
  return {
    products: getAllProducts(),
    faq: getAllFaq(),
    settings: getSettings(),
    shift_logs: getShiftLogs(500),
    exported_at: new Date().toISOString(),
  };
}

export function seedIfEmpty() {
  const database = getDb();
  const count = database
    .prepare("SELECT COUNT(*) as count FROM products")
    .get() as { count: number };
  if (count.count > 0) return;

  setSetting("cheer_message", DEFAULT_CHEER_MESSAGE);
  setSetting("pin_limit", String(DEFAULT_PIN_LIMIT));

  const samples: CreateProductInput[] = [
    {
      brand: "資生堂",
      name: "アルティミューン パワライジング セラム",
      shade: "50mL",
      category: "skincare",
      key_ingredients: ["イミューンジェネレーションRED", "ヒアルロン酸", "グリセリン"],
      ingredient_tags: ["fragrance_free", "sensitive_ok"],
      skin_types: ["dry", "sensitive", "normal"],
      talking_points: "土台から整える美容液。どんなスキンケアにも合わせやすいです。",
      is_pinned: true,
    },
    {
      brand: "カネボウ",
      name: "ルージュスターヴァイブラント",
      shade: "V13 陽炎",
      category: "lip",
      key_ingredients: ["スクワラン", "ホホバ油", "バラエキス"],
      ingredient_tags: ["caution_fragrance"],
      skin_types: ["normal", "combination"],
      talking_points: "粘膜に溶け込む発色。ティント感のあるツヤ仕上げです。",
      is_pinned: true,
    },
    {
      brand: "コスメデコルテ",
      name: "リポソーム アドバンスト リペアセラム",
      shade: "75mL",
      category: "skincare",
      key_ingredients: ["リポソーム", "トレハロース", "セラミド"],
      ingredient_tags: ["sensitive_ok"],
      skin_types: ["dry", "combination"],
      talking_points: "1本目の美容液として。角層のすみずみまでうるおいを届けます。",
      is_pinned: true,
    },
    {
      brand: "SUQQU",
      name: "ザ プライマー",
      shade: "30mL",
      category: "base",
      key_ingredients: ["シルクパウダー", "ヒアルロン酸", "グリセリン"],
      ingredient_tags: ["spf"],
      skin_types: ["normal", "combination", "oily"],
      talking_points: "毛穴の凹凸を整え、なめらかな肌印象に導く下地です。",
      is_pinned: true,
    },
    {
      brand: "RMK",
      name: "インフィニット ラスティング ファンデーション",
      shade: "102 ナチュラル",
      category: "base",
      key_ingredients: ["シルバーコロイド", "ヒアルロン酸", "植物オイル"],
      ingredient_tags: ["spf"],
      skin_types: ["combination", "normal"],
      talking_points: "薄づきなのに崩れにくい。自然なツヤ感が人気です。",
      is_pinned: true,
    },
    {
      brand: "THREE",
      name: "アライジング クレンジングオイル",
      shade: "200mL",
      category: "skincare",
      key_ingredients: ["オーガニックオイルブレンド", "センチペラエキス", "グレープフルーツ"],
      ingredient_tags: ["sensitive_ok", "caution_fragrance"],
      skin_types: ["dry", "sensitive", "normal"],
      talking_points: "オイルなのにさっぱり。マツエクにも使える方が多いです。",
      is_pinned: true,
    },
    {
      brand: "ADDICTION",
      name: "ザ アイシャドウ パレット",
      shade: "001 ニュートラル",
      category: "eye",
      key_ingredients: ["シルクパウダー", "ビタミンE", "ホホバ油"],
      ingredient_tags: [],
      skin_types: ["normal", "combination"],
      talking_points: "シマリングとマットを自由に組み合わせ。初心者にも使いやすいです。",
      is_pinned: true,
    },
    {
      brand: "クレ・ド・ポー ボーテ",
      name: "ヴォワールコレクチュールｎ",
      shade: "40g",
      category: "base",
      key_ingredients: ["ラベンダーエキス", "マロニエエキス", "ヒアルロン酸"],
      ingredient_tags: ["spf", "caution_fragrance"],
      skin_types: ["dry", "normal"],
      talking_points: "均一でなめらかな肌印象に。少量でカバー力を出せます。",
      is_pinned: true,
    },
    {
      brand: "イプサ",
      name: "メディテーテッド フロウ ローション",
      shade: "200mL",
      category: "skincare",
      key_ingredients: ["トラネキサム酸", "グリセリン", "ヒアルロン酸"],
      ingredient_tags: ["alcohol_free", "sensitive_ok"],
      skin_types: ["dry", "sensitive"],
      talking_points: "みずみずしく浸透。敏感肌の方にもおすすめしやすい化粧水です。",
    },
    {
      brand: "SHISEIDO",
      name: "マジェョリカ マジョルカ ラッシュセレクト",
      shade: "BK999",
      category: "eye",
      key_ingredients: ["ワックス", "カルナバロウ", "ヒアルロン酸"],
      ingredient_tags: ["caution_fragrance"],
      skin_types: ["normal"],
      talking_points: "繊維タイプでロングカール。プチプラなのに落ちにくいです。",
    },
    {
      brand: "ランコム",
      name: "ジェニフィック セラム",
      shade: "30mL",
      category: "skincare",
      key_ingredients: ["ビフィズス発酵エキス", "ビタミンC誘導体", "ヒアルロン酸"],
      ingredient_tags: ["caution_fragrance"],
      skin_types: ["dry", "normal"],
      talking_points: "透明感とハリ感をサポート。年齢を問わず人気の美容液です。",
    },
    {
      brand: "ディオール",
      name: "ルージュ ディオール",
      shade: "999 サテン",
      category: "lip",
      key_ingredients: ["ヒアルロン酸", "ツバキオイル", "ビタミンE"],
      ingredient_tags: ["caution_fragrance"],
      skin_types: ["normal"],
      talking_points: "発色とツヤのバランスが良い定番リップ。ギフトにも選ばれます。",
    },
    {
      brand: "エスティ ローダー",
      name: "アドバンス ナイト リペア SMR セラム",
      shade: "50mL",
      category: "skincare",
      key_ingredients: ["チャイダムナマズク", "ヒアルロン酸", "ペプチド"],
      ingredient_tags: ["caution_fragrance"],
      skin_types: ["dry", "combination"],
      talking_points: "夜の集中ケア用。寝ている間のうるおいケアを訴求できます。",
    },
    {
      brand: "NARS",
      name: "ラディアント クリーミー コンシーラー",
      shade: "カスタード",
      category: "base",
      key_ingredients: ["ビタミンE", "マルチプルオイル", "ミネラル"],
      ingredient_tags: [],
      skin_types: ["normal", "combination", "dry"],
      talking_points: "少量でカバー。クリームファンデ感覚で馴染ませます。",
    },
    {
      brand: "ポール & ジョー",
      name: "モイスチュアライジング ファンデーション",
      shade: "01",
      category: "base",
      key_ingredients: ["ラベンダーウォーター", "ヒアルロン酸", "アルガンオイル"],
      ingredient_tags: ["spf", "caution_fragrance"],
      skin_types: ["dry", "normal"],
      talking_points: "保湿重視のファンデ。カバーは中程度でツヤ感が特徴です。",
    },
    {
      brand: "ファンケル",
      name: "マイルドクレンジング オイル",
      shade: "120mL",
      category: "skincare",
      key_ingredients: ["ホホバ油", "グレープシードオイル", "ローズマリー"],
      ingredient_tags: ["fragrance_free", "sensitive_ok", "paraben_free"],
      skin_types: ["sensitive", "dry"],
      talking_points: "無添加・無香料。敏感肌の方に安心しておすすめできます。",
    },
    {
      brand: "ちふれ",
      name: "カラートリートメントリップ",
      shade: "504 ローズ",
      category: "lip",
      key_ingredients: ["スクワラン", "ホホバ油", "ワセリン"],
      ingredient_tags: ["paraben_free"],
      skin_types: ["normal", "dry"],
      talking_points: "色付きリップクリーム。プチプラで色味の提案がしやすいです。",
    },
    {
      brand: "ケイト",
      name: "リップモンスター",
      shade: "14 憧れの日光浴",
      category: "lip",
      key_ingredients: ["ヒアルロン酸", "スクワラン", "ツバキ油"],
      ingredient_tags: [],
      skin_types: ["normal", "combination"],
      talking_points: "高発色ティント。トレンドカラーとして提案しやすいです。",
    },
    {
      brand: "オルビス",
      name: "ユー ドット エッセンスローション",
      shade: "180mL",
      category: "skincare",
      key_ingredients: ["セラミド", "グリセリン", "ハトムギエキス"],
      ingredient_tags: ["alcohol_free", "fragrance_free", "sensitive_ok"],
      skin_types: ["sensitive", "dry"],
      talking_points: "シンプルケア志向の方に。刺激を抑えた処方です。",
    },
    {
      brand: "コスメデコルテ",
      name: "フェイスパウダー",
      shade: "10 ライトオークル",
      category: "base",
      key_ingredients: ["シルク", "ローズマリー", "ヒアルロン酸"],
      ingredient_tags: ["caution_fragrance"],
      skin_types: ["oily", "combination"],
      talking_points: "仕上げ用の定番。透明感のある仕上がりが特徴です。",
    },
    {
      brand: "アネッサ",
      name: "パーフェクトUV スキンケアミルク",
      shade: "60mL",
      category: "skincare",
      key_ingredients: ["ヒアルロン酸", "コラーゲン", "UV防御成分"],
      ingredient_tags: ["spf", "alcohol_free"],
      skin_types: ["normal", "combination", "oily"],
      talking_points: "強力なUV防御。スーパーウォータープルーフを訴求できます。",
    },
    {
      brand: "ジルスチュアート",
      name: "ブルーム ミックスブラッシュ コンパクト",
      shade: "01",
      category: "base",
      key_ingredients: ["シルク", "ローズエキス", "ヒアルロン酸"],
      ingredient_tags: ["caution_fragrance"],
      skin_types: ["normal"],
      talking_points: "花のような発色。チークのグラデーションが作りやすいです。",
    },
    {
      brand: "ラ ロッシュ ポゼ",
      name: "トレリアン ウルトラ トナー",
      shade: "200mL",
      category: "skincare",
      key_ingredients: ["センチペラアジアチカ", "ナイアシンアミド", "グリセリン"],
      ingredient_tags: ["fragrance_free", "sensitive_ok", "paraben_free"],
      skin_types: ["sensitive", "dry"],
      talking_points: "敏感肌ブランドの定番。皮膚科医監修をアピールできます。",
    },
    {
      brand: "スック",
      name: "グロウクリーム アイズ",
      shade: "03 シグナル",
      category: "eye",
      key_ingredients: ["パール", "ホホバ油", "ビタミンE"],
      ingredient_tags: [],
      skin_types: ["normal", "combination"],
      talking_points: "濡れ感のあるアイカラー。指で簡単に仕上げられます。",
    },
    {
      brand: "シャネル",
      name: "ル リフト クリーム",
      shade: "50g",
      category: "skincare",
      key_ingredients: ["アルガン", "ヒアルロン酸", "ペプチド"],
      ingredient_tags: ["caution_fragrance"],
      skin_types: ["dry", "normal"],
      talking_points: "ハリ・弾力ケアの高級クリーム。ライン使い提案にも向きます。",
    },
  ];

  for (const sample of samples) {
    createProduct(sample);
  }

  const faqs = [
    {
      question: "アルコールって肌に悪いの？",
      answer:
        "すべてのアルコールが刺激になるわけではありません。敏感肌の方はエタノールが高順位にある製品はパッチテストをおすすめすると安心です。",
      sort_order: 1,
    },
    {
      question: "パラベンとは何ですか？",
      answer:
        "防腐剤の一種です。現在の化粧品では使用濃度が規制されています。パラベンフリー訴求の商品は代替防腐剤を使用しています。",
      sort_order: 2,
    },
    {
      question: "敏感肌の方におすすめの見方は？",
      answer:
        "無香料・アルコールフリー・パッチテスト済みの表示を確認。新商品は耳裏や腕の内側で試してもらうとよいです。",
      sort_order: 3,
    },
    {
      question: "セラミドは何がいいの？",
      answer:
        "角層のバリア機能をサポートする成分です。乾燥や敏感が気になる方の保湿ケアでよくおすすめします。",
      sort_order: 4,
    },
    {
      question: "ナイアシンアミドとは？",
      answer:
        "ビタミンB3由来の成分。透明感やキメのケアで注目されています。敏感肌の方は少量から試すのがおすすめです。",
      sort_order: 5,
    },
  ];

  for (const faq of faqs) {
    createFaq(faq.question, faq.answer, faq.sort_order);
  }
}
