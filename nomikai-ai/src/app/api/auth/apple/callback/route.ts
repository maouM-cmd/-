import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSession, findOrCreateAppleUser } from "@/lib/db";
import { getSessionCookieOptions } from "@/lib/auth";
import { getAppUrl } from "@/lib/app-url";
import {
  APPLE_OAUTH_STATE_COOKIE,
  exchangeAppleCode,
  isAppleOAuthEnabled,
} from "@/lib/apple-oauth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAppleOAuthEnabled()) {
    return NextResponse.redirect(`${getAppUrl()}/login?error=apple_disabled`);
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const userJson = searchParams.get("user");
  const cookieStore = await cookies();
  const savedState = cookieStore.get(APPLE_OAUTH_STATE_COOKIE)?.value;

  cookieStore.delete(APPLE_OAUTH_STATE_COOKIE);

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(`${getAppUrl()}/login?error=apple_state`);
  }

  try {
    const profile = await exchangeAppleCode(code, userJson);
    const user = findOrCreateAppleUser(profile.apple_id, profile.email, profile.display_name);
    const token = createSession(user.id);
    const { name, value, options } = getSessionCookieOptions(token);
    cookieStore.set(name, value, options);

    return NextResponse.redirect(`${getAppUrl()}/my`);
  } catch {
    return NextResponse.redirect(`${getAppUrl()}/login?error=apple_failed`);
  }
}
