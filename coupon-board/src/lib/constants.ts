import type { Category } from "./types";

export const SITE_NAME = "招待みんなでショータイム";
export const SITE_TAGLINE = "みんなで招待、みんなでお得";

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: "payment", label: "決済・送金", emoji: "💳" },
  { value: "ec", label: "EC・通販", emoji: "🛒" },
  { value: "finance", label: "金融", emoji: "🏦" },
  { value: "subscription", label: "サブスク", emoji: "📱" },
  { value: "point", label: "ポイ活・アプリ", emoji: "⭐" },
  { value: "sidejob", label: "副業・仕事", emoji: "💼" },
  { value: "other", label: "その他", emoji: "📌" },
];

export function getCategoryLabel(category: Category): string {
  return CATEGORIES.find((c) => c.value === category)?.label ?? "その他";
}

export function getCategoryEmoji(category: Category): string {
  return CATEGORIES.find((c) => c.value === category)?.emoji ?? "📌";
}
