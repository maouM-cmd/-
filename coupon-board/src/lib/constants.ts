import type { Category } from "./types";

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: "ec", label: "EC・通販", emoji: "🛒" },
  { value: "food", label: "食品・グルメ", emoji: "🍜" },
  { value: "beauty", label: "美容・コスメ", emoji: "💄" },
  { value: "service", label: "サービス", emoji: "🔧" },
  { value: "subscription", label: "サブスク", emoji: "📱" },
  { value: "other", label: "その他", emoji: "📌" },
];

export function getCategoryLabel(category: Category): string {
  return CATEGORIES.find((c) => c.value === category)?.label ?? "その他";
}

export function getCategoryEmoji(category: Category): string {
  return CATEGORIES.find((c) => c.value === category)?.emoji ?? "📌";
}
