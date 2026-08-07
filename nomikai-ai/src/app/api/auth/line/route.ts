import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createLineOAuthState,
  getLineAuthUrl,
  isLineOAuthEnabled,
  LINE_OAUTH_STATE_COOKIE,
} from "@/lib/line-oauth";

export const runtime = "nodejs";

export async function GET() {
  if (!isLineOAuthEnabled()) {
    return NextResponse.json({ error: "LINE OAuth is not configured" }, { status: 503 });
  }

  const state = createLineOAuthState();
  const cookieStore = await cookies();
  cookieStore.set(LINE_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return NextResponse.redirect(getLineAuthUrl(state));
}
