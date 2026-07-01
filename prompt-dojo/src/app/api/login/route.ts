import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { getSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const email = (body.email as string)?.trim().toLowerCase();
  const password = body.password as string;

  if (!email || !password) {
    return NextResponse.json({ error: "メールとパスワードを入力してください" }, { status: 400 });
  }

  const user = getUserByEmail(email);
  if (!user || !user.password_hash) {
    return NextResponse.json({ error: "メールまたはパスワードが違います" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "メールまたはパスワードが違います" }, { status: 401 });
  }

  const session = getSessionCookie(user.session_token);
  const response = NextResponse.json({
    user: { id: user.id, display_name: user.display_name, email: user.email },
  });
  response.cookies.set(session.name, session.value, session.options);
  return response;
}
