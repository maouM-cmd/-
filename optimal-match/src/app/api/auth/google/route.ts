import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createOAuthState,
  getGoogleAuthUrl,
  isGoogleOAuthEnabled,
  OAUTH_STATE_COOKIE,
} from "@/lib/oauth";

export async function GET() {
  if (!isGoogleOAuthEnabled()) {
    return NextResponse.json({ error: "Google OAuth is not configured" }, { status: 503 });
  }

  const state = createOAuthState();
  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return NextResponse.redirect(getGoogleAuthUrl(state));
}
