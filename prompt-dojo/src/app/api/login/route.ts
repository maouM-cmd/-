import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { apiError, ApiErrorCode } from "@/lib/api-errors";
import { getUserByEmail } from "@/lib/db";
import { getSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const email = (body.email as string)?.trim().toLowerCase();
  const password = body.password as string;

  if (!email || !password) {
    return apiError(ApiErrorCode.MISSING_EMAIL_PASSWORD, 400);
  }

  const user = getUserByEmail(email);
  if (!user || !user.password_hash) {
    return apiError(ApiErrorCode.INVALID_CREDENTIALS, 401);
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return apiError(ApiErrorCode.INVALID_CREDENTIALS, 401);
  }

  const session = getSessionCookie(user.session_token);
  const response = NextResponse.json({
    user: { id: user.id, display_name: user.display_name, email: user.email },
  });
  response.cookies.set(session.name, session.value, session.options);
  return response;
}
