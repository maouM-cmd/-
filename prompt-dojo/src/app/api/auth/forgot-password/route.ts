import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ApiErrorCode, apiError } from "@/lib/api-errors";
import {
  consumeAuthToken,
  createAuthToken,
  getUserByEmail,
  updateUserPassword,
} from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json();
  const email = (body.email as string)?.trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    return apiError(ApiErrorCode.INVALID_EMAIL, 400);
  }

  const user = getUserByEmail(email);
  if (user?.password_hash) {
    const token = createAuthToken(user.id, "password_reset", 1);
    await sendPasswordResetEmail(email, token, user.preferred_locale ?? "ja");
  }

  return NextResponse.json({
    ok: true,
    messageCode: "PASSWORD_RESET_SENT",
    message:
      "登録されているメールアドレスの場合、パスワードリセット用のメールを送信しました。",
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const token = (body.token as string)?.trim();
  const password = body.password as string;

  if (!token) {
    return apiError(ApiErrorCode.TOKEN_REQUIRED, 400);
  }
  if (!password || password.length < 8) {
    return apiError(ApiErrorCode.INVALID_PASSWORD, 400);
  }

  const userId = consumeAuthToken(token, "password_reset");
  if (!userId) {
    return apiError(ApiErrorCode.TOKEN_INVALID, 400);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  updateUserPassword(userId, passwordHash);

  return NextResponse.json({ ok: true, messageCode: "PASSWORD_UPDATED" });
}
