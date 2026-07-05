export function photoUrl(filename: string | null | undefined): string | null {
  if (!filename) return null;
  return `/api/uploads/${encodeURIComponent(filename)}`;
}
