import { NextRequest, NextResponse } from "next/server";
import {
  getAdminClearCookie,
  getAdminSessionCookie,
  verifyAdminPassword,
} from "@/lib/admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!verifyAdminPassword(body.password ?? "")) {
    return NextResponse.json({ error: "パスワードが違います" }, { status: 401 });
  }

  const cookie = getAdminSessionCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}

export async function DELETE() {
  const cookie = getAdminClearCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie.name, cookie.value, { maxAge: cookie.maxAge });
  return response;
}
