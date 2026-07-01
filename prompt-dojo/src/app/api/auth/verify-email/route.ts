import { NextResponse } from "next/server";
import {
  consumeAuthToken,
  createAuthToken,
  markEmailVerified,
} from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "トークンが必要です" }, { status: 400 });
  }

  const userId = consumeAuthToken(token, "email_verify");
  if (!userId) {
    return NextResponse.json(
      { error: "リンクが無効か期限切れです" },
      { status: 400 },
    );
  }

  markEmailVerified(userId);
  return NextResponse.json({ ok: true, message: "メールアドレスを確認しました" });
}

export async function POST() {
  const user = await getCurrentUser();
  if (!user || !user.email) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  if (user.email_verified === 1) {
    return NextResponse.json({ ok: true, message: "既に確認済みです" });
  }

  const token = createAuthToken(user.id, "email_verify", 24);
  await sendVerificationEmail(user.email, token, user.preferred_locale ?? "ja");

  return NextResponse.json({
    ok: true,
    message: "確認メールを送信しました",
  });
}
