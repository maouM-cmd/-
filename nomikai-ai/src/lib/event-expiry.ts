import { EVENT_TTL_DAYS } from "./constants";

export function isEventExpired(expiresAt: string): boolean {
  const expires = new Date(expiresAt);
  return !Number.isNaN(expires.getTime()) && expires.getTime() < Date.now();
}

export function defaultExpiresAt(): string {
  const d = new Date();
  d.setDate(d.getDate() + EVENT_TTL_DAYS);
  return d.toISOString();
}
