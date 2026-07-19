const OAUTH_ERRORS: Record<string, string> = {
  oauth_disabled: "ソーシャルログインは現在利用できません",
  oauth_state: "ログインに失敗しました。もう一度お試しください",
  oauth_failed: "ログインに失敗しました",
  line_disabled: "LINEログインは現在利用できません",
  line_state: "LINEログインに失敗しました。もう一度お試しください",
  line_failed: "LINEログインに失敗しました",
  apple_disabled: "Appleログインは現在利用できません",
  apple_state: "Appleログインに失敗しました。もう一度お試しください",
  apple_failed: "Appleログインに失敗しました",
};

export function getOAuthErrorMessage(error?: string | null): string | null {
  if (!error) return null;
  return OAUTH_ERRORS[error] ?? null;
}
