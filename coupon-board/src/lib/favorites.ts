export const FAVORITES_KEY = "shotime_favorites";

export function getFavoriteIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

export function setFavoriteIds(ids: number[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function toggleFavorite(dealId: number): boolean {
  const ids = getFavoriteIds();
  const exists = ids.includes(dealId);
  const next = exists ? ids.filter((id) => id !== dealId) : [...ids, dealId];
  setFavoriteIds(next);
  return !exists;
}

export function isFavorite(dealId: number): boolean {
  return getFavoriteIds().includes(dealId);
}
