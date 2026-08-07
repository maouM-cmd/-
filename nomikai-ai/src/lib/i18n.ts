export type Locale = "ja" | "en";

export function normalizeLocale(value?: string | null): Locale {
  return value === "en" ? "en" : "ja";
}

export function withLang(path: string, locale: Locale): string {
  if (locale === "ja") return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}lang=${locale}`;
}
