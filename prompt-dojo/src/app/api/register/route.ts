import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createUserWithEmail, getUserByEmail } from "@/lib/db";
import { getSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json();
  const email = (body.email as string)?.trim().toLowerCase();
  const password = body.password as string;
  const displayName = (body.display_name as string)?.trim();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "有効なメールアドレスを入力してください" }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json({ error: "パスワードは8文字以上で入力してください" }, { status: 400 });
  }
  if (!displayName || displayName.length < 1 || displayName.length > 20) {
    return NextResponse.json({ error: "ニックネームは1〜20文字で入力してください" }, { status: 400 });
  }

  if (getUserByEmail(email)) {
    return NextResponse.json({ error: "このメールアドレスは既に登録されています" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = createUserWithEmail(email, passwordHash, displayName);

  const session = getSessionCookie(user.session_token);
  const response = NextResponse.json({ user: { id: user.id, display_name: user.display_name, email: user.email } }, { status: 201 });
  response.cookies.set(session.name, session.value, session.options);
  return response;
}
