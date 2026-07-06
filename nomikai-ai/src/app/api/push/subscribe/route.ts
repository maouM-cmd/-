import { NextResponse } from "next/server";
import { savePushSubscription, verifyEditToken } from "@/lib/db";
import { getVapidPublicKey } from "@/lib/push";

export const runtime = "nodejs";

export async function GET() {
  const key = getVapidPublicKey();
  if (!key) {
    return NextResponse.json({ enabled: false, publicKey: null });
  }
  return NextResponse.json({ enabled: true, publicKey: key });
}

export async function POST(request: Request) {
  const body = await request.json();
  const slug = body.slug as string | undefined;
  const editToken = body.edit_token as string | undefined;
  const endpoint = body.endpoint as string;
  const keys = body.keys as { p256dh?: string; auth?: string };

  if (!slug || !editToken) {
    return NextResponse.json({ error: "slug と edit_token が必要です" }, { status: 400 });
  }

  const event = verifyEditToken(slug, editToken);
  if (!event) {
    return NextResponse.json({ error: "認証に失敗しました" }, { status: 403 });
  }

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "invalid subscription" }, { status: 400 });
  }

  savePushSubscription(event.id, endpoint, keys.p256dh, keys.auth);
  return NextResponse.json({ ok: true });
}
