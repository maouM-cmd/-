import type { User } from "./types";

export function isEmailVerified(user: User): boolean {
  if (user.oauth_provider) return true;
  if (!user.email) return true;
  return user.email_verified === 1;
}

export function emailVerificationRequiredMessage(): string {
  return "メールアドレスの確認が必要です。受信トレイの確認メールを開いてください。";
}
