import { NextResponse } from "next/server";
import { savePushSubscription } from "@/lib/db";
import { getVapidPublicKey } from "@/lib/push";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const key = getVapidPublicKey();
  if (!key) {
    return NextResponse.json({ enabled: false, publicKey: null });
  }
  return NextResponse.json({ enabled: true, publicKey: key });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json();
  const endpoint = body.endpoint as string;
  const keys = body.keys as { p256dh?: string; auth?: string };

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "invalid subscription" }, { status: 400 });
  }

  savePushSubscription(user.id, endpoint, keys.p256dh, keys.auth);
  return NextResponse.json({ ok: true });
}
