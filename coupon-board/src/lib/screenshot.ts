export function getScreenshotUrl(filename: string | null): string | null {
  if (!filename) return null;
  return `/api/uploads/${encodeURIComponent(filename)}`;
}
