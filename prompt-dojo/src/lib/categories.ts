import type { Category } from "./types";

export function getCategoryLabel(category: Category, locale: string): string {
  return locale === "en" ? category.name_en : category.name_ja;
}
