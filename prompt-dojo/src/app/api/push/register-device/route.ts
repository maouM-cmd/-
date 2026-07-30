import { NextResponse } from "next/server";
import { apiError, ApiErrorCode } from "@/lib/api-errors";
import { deleteDeviceToken, saveDeviceToken } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

const PLATFORMS = new Set(["android", "ios"]);

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(ApiErrorCode.AUTH_REQUIRED, 401);
  }

  const body = await request.json();
  const platform = body.platform as string;
  const token = (body.token as string)?.trim();
  const locale = (body.locale as string) === "en" ? "en" : "ja";

  if (!platform || !PLATFORMS.has(platform)) {
    return apiError(ApiErrorCode.INVALID_PUSH_SUBSCRIPTION, 400);
  }
  if (!token) {
    return apiError(ApiErrorCode.INVALID_PUSH_SUBSCRIPTION, 400);
  }

  saveDeviceToken(user.id, platform as "android" | "ios", token, locale);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(ApiErrorCode.AUTH_REQUIRED, 401);
  }

  const body = await request.json();
  const token = (body.token as string)?.trim();
  if (token) {
    deleteDeviceToken(user.id, token);
  }
  return NextResponse.json({ ok: true });
}
