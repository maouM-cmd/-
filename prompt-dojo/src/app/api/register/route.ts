import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { apiError, ApiErrorCode } from "@/lib/api-errors";
import { createAuthToken, createUserWithEmail, getUserByEmail } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { getSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json();
  const email = (body.email as string)?.trim().toLowerCase();
  const password = body.password as string;
  const displayName = (body.display_name as string)?.trim();

  if (!email || !EMAIL_RE.test(email)) {
    return apiError(ApiErrorCode.INVALID_EMAIL, 400);
  }
  if (!password || password.length < 8) {
    return apiError(ApiErrorCode.INVALID_PASSWORD, 400);
  }
  if (!displayName || displayName.length < 1 || displayName.length > 20) {
    return apiError(ApiErrorCode.INVALID_NICKNAME, 400);
  }

  if (getUserByEmail(email)) {
    return apiError(ApiErrorCode.EMAIL_ALREADY_EXISTS, 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const locale = (body.locale as string) === "en" ? "en" : "ja";
  const user = createUserWithEmail(email, passwordHash, displayName, locale);

  const token = createAuthToken(user.id, "email_verify", 24);
  await sendVerificationEmail(email, token, locale);

  const session = getSessionCookie(user.session_token);
  const response = NextResponse.json(
    {
      user: { id: user.id, display_name: user.display_name, email: user.email },
      messageCode: "REGISTRATION_EMAIL_SENT",
    },
    { status: 201 },
  );
  response.cookies.set(session.name, session.value, session.options);
  return response;
}
