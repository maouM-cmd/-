import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import {
  consumeAuthToken,
  createAuthToken,
  getUserByEmail,
  updateUserPassword,
} from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json();
  const email = (body.email as string)?.trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "有効なメールアドレスを入力してください" },
      { status: 400 },
    );
  }

  const user = getUserByEmail(email);
  if (user?.password_hash) {
    const token = createAuthToken(user.id, "password_reset", 1);
    await sendPasswordResetEmail(email, token);
  }

  return NextResponse.json({
    ok: true,
    message:
      "登録されているメールアドレスの場合、パスワードリセット用のメールを送信しました。",
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const token = (body.token as string)?.trim();
  const password = body.password as string;

  if (!token) {
    return NextResponse.json({ error: "トークンが必要です" }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "パスワードは8文字以上で入力してください" },
      { status: 400 },
    );
  }

  const userId = consumeAuthToken(token, "password_reset");
  if (!userId) {
    return NextResponse.json(
      { error: "リンクが無効か期限切れです" },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  updateUserPassword(userId, passwordHash);

  return NextResponse.json({ ok: true, message: "パスワードを更新しました" });
}
