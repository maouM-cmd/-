export function getAppBaseUrl(): string {
  const url = process.env.APP_URL?.trim();
  if (!url) return "";
  return url.replace(/\/$/, "");
}

export function getAppUrl(): string {
  const base = getAppBaseUrl();
  if (base) return base;
  const publicUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (publicUrl) return publicUrl.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function absoluteAppUrl(path: string): string {
  const base = getAppBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}
