export function getAppBaseUrl(): string {
  const url = process.env.APP_URL?.trim();
  if (!url) return "";
  return url.replace(/\/$/, "");
}

export function absoluteAppUrl(path: string): string {
  const base = getAppBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}
