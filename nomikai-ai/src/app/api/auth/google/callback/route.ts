import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSession, findOrCreateGoogleUser } from "@/lib/db";
import { getSessionCookieOptions } from "@/lib/auth";
import {
  exchangeGoogleCode,
  getAppUrl,
  isGoogleOAuthEnabled,
  OAUTH_STATE_COOKIE,
} from "@/lib/oauth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isGoogleOAuthEnabled()) {
    return NextResponse.redirect(`${getAppUrl()}/login?error=oauth_disabled`);
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookieStore = await cookies();
  const savedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;

  cookieStore.delete(OAUTH_STATE_COOKIE);

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(`${getAppUrl()}/login?error=oauth_state`);
  }

  try {
    const profile = await exchangeGoogleCode(code);
    const user = findOrCreateGoogleUser(profile.google_id, profile.email, profile.display_name);
    const token = createSession(user.id);
    const { name, value, options } = getSessionCookieOptions(token);
    cookieStore.set(name, value, options);

    return NextResponse.redirect(`${getAppUrl()}/my`);
  } catch {
    return NextResponse.redirect(`${getAppUrl()}/login?error=oauth_failed`);
  }
}
