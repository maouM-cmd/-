import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/db";
import { getClearSessionCookie, getSessionTokenFromCookies } from "@/lib/auth";

export async function POST() {
  const token = await getSessionTokenFromCookies();
  if (token) deleteSession(token);

  const cookie = getClearSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, { maxAge: cookie.maxAge, path: "/" });
  return res;
}
