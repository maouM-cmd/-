import { NextResponse } from "next/server";
import { updateUserLocale as setDbLocale } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

const ALLOWED = new Set(["ja", "en"]);

export async function POST(request: Request) {
  const body = await request.json();
  const locale = (body.locale as string)?.trim();

  if (!locale || !ALLOWED.has(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (user) {
    setDbLocale(user.id, locale);
  }

  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}
