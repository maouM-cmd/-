import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { findOrCreateUser } from "@/lib/db";
import { createSessionToken, getSessionCookie } from "@/lib/session";

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

  const cookieStore = await cookies();
  const existingToken = cookieStore.get("prompt_dojo_session")?.value;
  const token = existingToken ?? createSessionToken();
  const user = findOrCreateUser(token, displayName);

  const session = getSessionCookie(token);
  const response = NextResponse.json({ user });
  response.cookies.set(session.name, session.value, session.options);
  return response;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("prompt_dojo_session")?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }
  const { getUserBySessionToken } = await import("@/lib/db");
  const user = getUserBySessionToken(token);
  return NextResponse.json({ user });
}
