import type { IngredientTagId, ProductCategory, SkinType } from "./types";

export const SITE_NAME = "コスメノート";
export const SITE_TAGLINE = "今日の5商品だけ覚えればOK";

export const DEFAULT_PIN_LIMIT = 8;

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  base: "ベースメイク",
  lip: "リップ",
  eye: "アイメイク",
  skincare: "スキンケア",
  fragrance: "フレグランス",
  other: "その他",
};

export const SKIN_TYPE_LABELS: Record<SkinType, string> = {
  dry: "乾燥肌",
  oily: "脂性肌",
  combination: "混合肌",
  sensitive: "敏感肌",
  normal: "普通肌",
};

export interface IngredientTagDef {
  id: IngredientTagId;
  label: string;
  tone: "positive" | "neutral" | "caution";
}

export const INGREDIENT_TAGS: IngredientTagDef[] = [
  { id: "alcohol_free", label: "アルコールフリー", tone: "positive" },
  { id: "paraben_free", label: "パラベンフリー", tone: "positive" },
  { id: "fragrance_free", label: "無香料", tone: "positive" },
  { id: "sensitive_ok", label: "敏感肌OK", tone: "positive" },
  { id: "vegan", label: "ヴィーガン", tone: "positive" },
  { id: "spf", label: "UVカット", tone: "neutral" },
  { id: "caution_alcohol", label: "アルコール含有", tone: "caution" },
  { id: "caution_fragrance", label: "香料あり", tone: "caution" },
];

export const INGREDIENT_TAG_MAP = Object.fromEntries(
  INGREDIENT_TAGS.map((t) => [t.id, t])
) as Record<IngredientTagId, IngredientTagDef>;

export const COMMON_INGREDIENTS = [
  "ヒアルロン酸",
  "セラミド",
  "ナイアシンアミド",
  "レチノール",
  "ビタミンC誘導体",
  "スクワラン",
  "グリセリン",
  "コラーゲン",
  "アルガンオイル",
  "ツボクサエキス",
  "センチペラアジアチカエキス",
  "トレハロース",
  "アラントイン",
  "シカ成分",
  "SPF50+",
  "PA++++",
];

export const DEFAULT_CHEER_MESSAGE =
  "毎日お疲れさま。無理に全部覚えなくていいよ。今日の分だけで十分えらい。";

export const STUDY_COMPLETE_MESSAGE = "がんばってるね。今日の分、ばっちり！";
