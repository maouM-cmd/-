import { NextResponse } from "next/server";
import { ApiErrorCode, apiError } from "@/lib/api-errors";
import {
  consumeAuthToken,
  createAuthToken,
  markEmailVerified,
} from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return apiError(ApiErrorCode.TOKEN_REQUIRED, 400);
  }

  const userId = consumeAuthToken(token, "email_verify");
  if (!userId) {
    return apiError(ApiErrorCode.TOKEN_INVALID, 400);
  }

  markEmailVerified(userId);
  return NextResponse.json({ ok: true, messageCode: "EMAIL_VERIFIED" });
}

export async function POST() {
  const user = await getCurrentUser();
  if (!user || !user.email) {
    return apiError(ApiErrorCode.AUTH_REQUIRED, 401);
  }

  if (user.email_verified === 1) {
    return NextResponse.json({ ok: true, messageCode: "EMAIL_ALREADY_VERIFIED" });
  }

  const token = createAuthToken(user.id, "email_verify", 24);
  await sendVerificationEmail(user.email, token, user.preferred_locale ?? "ja");

  return NextResponse.json({ ok: true, messageCode: "VERIFICATION_EMAIL_SENT" });
}
