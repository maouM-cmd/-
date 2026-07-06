import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { absoluteAppUrl } from "@/lib/app-url";
import { cloneEvent, getUserBySession, verifyEditToken } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body = (await request.json()) as { edit_token?: string };
    const editToken = body.edit_token;

    let auth: { editToken?: string; sessionUserId?: number };

    if (editToken) {
      const event = verifyEditToken(slug, editToken);
      if (!event) {
        return NextResponse.json({ error: "認証に失敗しました" }, { status: 403 });
      }
      auth = { editToken };
    } else {
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
      if (!sessionToken) {
        return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
      }
      const user = getUserBySession(sessionToken);
      if (!user) {
        return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
      }
      auth = { sessionUserId: user.id };
    }

    const cloned = cloneEvent(slug, auth);
    if (!cloned) {
      return NextResponse.json({ error: "複製に失敗しました" }, { status: 403 });
    }

    return NextResponse.json({
      slug: cloned.slug,
      edit_token: cloned.edit_token,
      organizer_url: absoluteAppUrl(`/e/${cloned.slug}?token=${cloned.edit_token}`),
      share_url: absoluteAppUrl(`/e/${cloned.slug}`),
    });
  } catch {
    return NextResponse.json({ error: "複製中にエラーが発生しました" }, { status: 500 });
  }
}
