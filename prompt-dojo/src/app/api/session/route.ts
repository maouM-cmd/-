import { NextResponse } from "next/server";
import { findOrCreateUser } from "@/lib/db";
import { createSessionToken, getCurrentUser, getSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const displayName = (body.display_name as string)?.trim();
  if (!displayName || displayName.length < 1 || displayName.length > 20) {
    return NextResponse.json(
      { error: "ニックネームは1〜20文字で入力してください" },
      { status: 400 },
    );
  }

  const existingUser = await getCurrentUser();
  if (existingUser) {
    return NextResponse.json({ user: existingUser });
  }

  const token = createSessionToken();
  const user = findOrCreateUser(token, displayName);

  const session = getSessionCookie(token);
  const response = NextResponse.json({ user });
  response.cookies.set(session.name, session.value, session.options);
  return response;
}

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}
