import { NextResponse } from "next/server";
import { deleteEvent, getEventDetail, verifyEditToken } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const detail = getEventDetail(slug);
  if (!detail) {
    return NextResponse.json({ error: "イベントが見つかりません" }, { status: 404 });
  }

  const { event, participants, plan, expired } = detail;
  return NextResponse.json({
    event: {
      slug: event.slug,
      title: event.title,
      organizer_name: event.organizer_name,
      budget: event.budget,
      mood: event.mood,
      date_options: event.date_options,
      expires_at: event.expires_at,
      created_at: event.created_at,
    },
    participants: participants.map((p) => ({
      id: p.id,
      name: p.name,
      station: p.station,
      availability: p.availability,
      created_at: p.created_at,
    })),
    plan,
    expired,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body = (await request.json()) as { edit_token?: string };
    if (!body.edit_token) {
      return NextResponse.json({ error: "幹事トークンが必要です" }, { status: 401 });
    }

    const event = verifyEditToken(slug, body.edit_token);
    if (!event) {
      return NextResponse.json({ error: "認証に失敗しました" }, { status: 403 });
    }

    deleteEvent(slug);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
