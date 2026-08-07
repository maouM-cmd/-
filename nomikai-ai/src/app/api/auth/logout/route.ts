import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/db";
import { SESSION_COOKIE, getClearSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) deleteSession(token);

  const res = NextResponse.json({ ok: true });
  const clear = getClearSessionCookie();
  res.cookies.set(clear.name, clear.value, { maxAge: clear.maxAge, path: "/" });
  return res;
}
