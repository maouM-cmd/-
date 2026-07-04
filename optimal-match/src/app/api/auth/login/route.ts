import { NextResponse } from "next/server";
import { authenticateUser, createSession } from "@/lib/db";
import { getSessionCookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const email = (body.email ?? "").trim();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "メールとパスワードを入力してください" }, { status: 400 });
  }

  const user = authenticateUser(email, password);
  if (!user) {
    return NextResponse.json({ error: "メールまたはパスワードが違います" }, { status: 401 });
  }

  const token = createSession(user.id);
  const cookie = getSessionCookieOptions(token);
  const res = NextResponse.json({
    user: { id: user.id, email: user.email, display_name: user.display_name },
  });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
