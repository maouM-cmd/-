import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createAppleOAuthState,
  getAppleAuthUrl,
  isAppleOAuthEnabled,
  APPLE_OAUTH_STATE_COOKIE,
} from "@/lib/apple-oauth";

export const runtime = "nodejs";

export async function GET() {
  if (!isAppleOAuthEnabled()) {
    return NextResponse.json({ error: "Apple OAuth is not configured" }, { status: 503 });
  }

  const state = createAppleOAuthState();
  const cookieStore = await cookies();
  cookieStore.set(APPLE_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return NextResponse.redirect(getAppleAuthUrl(state));
}
