import { NextResponse } from "next/server";
import { createSession, createUser } from "@/lib/db";
import { getSessionCookieOptions, isValidEmail, validatePassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const email = (body.email ?? "").trim();
  const password = body.password ?? "";
  const displayName = (body.display_name ?? body.displayName ?? "").trim();

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "有効なメールアドレスを入力してください" }, { status: 400 });
  }
  const pwErr = validatePassword(password);
  if (pwErr) return NextResponse.json({ error: pwErr }, { status: 400 });
  if (!displayName) {
    return NextResponse.json({ error: "表示名を入力してください" }, { status: 400 });
  }

  try {
    const user = createUser(email, password, displayName);
    const token = createSession(user.id);
    const cookie = getSessionCookieOptions(token);
    const res = NextResponse.json({
      user: { id: user.id, email: user.email, display_name: user.display_name },
    });
    res.cookies.set(cookie.name, cookie.value, cookie.options);
    return res;
  } catch (e) {
    if (e instanceof Error && e.message === "EMAIL_EXISTS") {
      return NextResponse.json({ error: "このメールアドレスは既に登録されています" }, { status: 409 });
    }
    return NextResponse.json({ error: "登録に失敗しました" }, { status: 500 });
  }
}
