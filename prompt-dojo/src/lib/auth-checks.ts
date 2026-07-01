import type { User } from "./types";

export function isEmailVerified(user: User): boolean {
  if (user.oauth_provider) return true;
  if (!user.email) return true;
  return user.email_verified === 1;
}
