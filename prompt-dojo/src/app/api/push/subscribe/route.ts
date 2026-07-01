import { NextResponse } from "next/server";
import { ApiErrorCode, apiError } from "@/lib/api-errors";
import { deletePushSubscription, savePushSubscription } from "@/lib/db";
import { getVapidPublicKey } from "@/lib/push";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const publicKey = getVapidPublicKey();
  if (!publicKey) {
    return NextResponse.json({ publicKey: null });
  }
  return NextResponse.json({ publicKey });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(ApiErrorCode.AUTH_REQUIRED, 401);
  }

  const body = await request.json();
  const endpoint = body.endpoint as string;
  const keys = body.keys as { p256dh: string; auth: string };

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return apiError(ApiErrorCode.INVALID_PUSH_SUBSCRIPTION, 400);
  }

  savePushSubscription(user.id, endpoint, keys.p256dh, keys.auth);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(ApiErrorCode.AUTH_REQUIRED, 401);
  }

  const body = await request.json();
  const endpoint = body.endpoint as string;
  if (endpoint) {
    deletePushSubscription(user.id, endpoint);
  }
  return NextResponse.json({ ok: true });
}
