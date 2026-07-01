import { NextResponse } from "next/server";

export const ApiErrorCode = {
  AUTH_REQUIRED: "AUTH_REQUIRED",
  ADMIN_AUTH_REQUIRED: "ADMIN_AUTH_REQUIRED",
  ADMIN_WRONG_PASSWORD: "ADMIN_WRONG_PASSWORD",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  INVALID_EMAIL: "INVALID_EMAIL",
  INVALID_PASSWORD: "INVALID_PASSWORD",
  INVALID_NICKNAME: "INVALID_NICKNAME",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  MISSING_EMAIL_PASSWORD: "MISSING_EMAIL_PASSWORD",
  TOKEN_REQUIRED: "TOKEN_REQUIRED",
  TOKEN_INVALID: "TOKEN_INVALID",
  CHALLENGE_NOT_FOUND: "CHALLENGE_NOT_FOUND",
  SUBMISSION_NOT_FOUND: "SUBMISSION_NOT_FOUND",
  INVALID_TITLE: "INVALID_TITLE",
  INVALID_DESCRIPTION: "INVALID_DESCRIPTION",
  INVALID_PROMPT: "INVALID_PROMPT",
  INVALID_PROMPT_TOO_LONG: "INVALID_PROMPT_TOO_LONG",
  INVALID_COMMENT: "INVALID_COMMENT",
  COMMENT_TARGET_INVALID: "COMMENT_TARGET_INVALID",
  INVALID_THEME: "INVALID_THEME",
  CHALLENGE_GEN_FAILED: "CHALLENGE_GEN_FAILED",
  INVALID_PUSH_SUBSCRIPTION: "INVALID_PUSH_SUBSCRIPTION",
  INVALID_LOCALE: "INVALID_LOCALE",
  INVALID_ID: "INVALID_ID",
  APPROVE_FAILED: "APPROVE_FAILED",
  UNKNOWN_ACTION: "UNKNOWN_ACTION",
  CANNOT_RATE_OWN: "CANNOT_RATE_OWN",
  INVALID_RATING: "INVALID_RATING",
  CHALLENGE_GEN_DISABLED: "CHALLENGE_GEN_DISABLED",
  CHALLENGE_GEN_LIMIT_REACHED: "CHALLENGE_GEN_LIMIT_REACHED",
  INVALID_REPORT_REASON: "INVALID_REPORT_REASON",
  CANNOT_REPORT: "CANNOT_REPORT",
  GENERIC_ERROR: "GENERIC_ERROR",
} as const;

export type ApiErrorCodeType = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

const FALLBACK_JA: Record<ApiErrorCodeType, string> = {
  AUTH_REQUIRED: "ログインが必要です",
  ADMIN_AUTH_REQUIRED: "認証が必要です",
  ADMIN_WRONG_PASSWORD: "パスワードが違います",
  EMAIL_NOT_VERIFIED: "メールアドレスの確認が必要です。受信トレイの確認メールを開いてください。",
  INVALID_EMAIL: "有効なメールアドレスを入力してください",
  INVALID_PASSWORD: "パスワードは8文字以上で入力してください",
  INVALID_NICKNAME: "ニックネームは1〜20文字で入力してください",
  EMAIL_ALREADY_EXISTS: "このメールアドレスは既に登録されています",
  INVALID_CREDENTIALS: "メールまたはパスワードが違います",
  MISSING_EMAIL_PASSWORD: "メールとパスワードを入力してください",
  TOKEN_REQUIRED: "トークンが必要です",
  TOKEN_INVALID: "リンクが無効か期限切れです",
  CHALLENGE_NOT_FOUND: "課題が見つかりません",
  SUBMISSION_NOT_FOUND: "投稿が見つかりません",
  INVALID_TITLE: "タイトルは1〜100文字で入力してください",
  INVALID_DESCRIPTION: "説明は1〜2000文字で入力してください",
  INVALID_PROMPT: "プロンプトは10文字以上で入力してください",
  INVALID_PROMPT_TOO_LONG: "プロンプトは5000文字以内で入力してください",
  INVALID_COMMENT: "コメントは1〜1000文字で入力してください",
  COMMENT_TARGET_INVALID: "投稿が見つからないか、返信先が無効です",
  INVALID_THEME: "テーマは1〜100文字で入力してください",
  CHALLENGE_GEN_FAILED: "課題の生成に失敗しました",
  INVALID_PUSH_SUBSCRIPTION: "無効な購読データです",
  INVALID_LOCALE: "無効なロケールです",
  INVALID_ID: "無効なIDです",
  APPROVE_FAILED: "承認できません",
  UNKNOWN_ACTION: "不明な操作です",
  CANNOT_RATE_OWN: "自分の投稿は評価できません",
  INVALID_RATING: "評価は1〜5の星で行ってください",
  CHALLENGE_GEN_DISABLED: "AI課題生成は現在利用できません",
  CHALLENGE_GEN_LIMIT_REACHED: "本日のAI課題生成上限に達しました",
  INVALID_REPORT_REASON: "通報理由を選択してください",
  CANNOT_REPORT: "通報できません（投稿が見つからないか、自分の投稿です）",
  GENERIC_ERROR: "エラーが発生しました",
};

export function apiError(code: ApiErrorCodeType, status: number) {
  return NextResponse.json(
    { errorCode: code, error: FALLBACK_JA[code] },
    { status },
  );
}

export function apiErrorWithMessage(
  code: ApiErrorCodeType,
  message: string,
  status: number,
) {
  return NextResponse.json({ errorCode: code, error: message }, { status });
}
