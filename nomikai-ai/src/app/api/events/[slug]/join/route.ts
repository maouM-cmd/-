import { NextResponse } from "next/server";
import { absoluteAppUrl } from "@/lib/app-url";
import { addParticipant, getEventBySlug, isEventExpired } from "@/lib/db";
import { checkAndNotifyAllAnswered } from "@/lib/notification-service";
import { sendPushToEvent } from "@/lib/push";
import type { JoinEventInput } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const eventCheck = getEventBySlug(slug);
    if (!eventCheck) {
      return NextResponse.json({ error: "イベントが見つかりません" }, { status: 404 });
    }
    if (isEventExpired(eventCheck.expires_at)) {
      return NextResponse.json({ error: "この飲み会は終了しています" }, { status: 403 });
    }

    const body = (await request.json()) as JoinEventInput;

    if (!body.name?.trim() || !body.station?.trim()) {
      return NextResponse.json({ error: "名前と最寄駅は必須です" }, { status: 400 });
    }
    if (!Array.isArray(body.availability) || body.availability.length === 0) {
      return NextResponse.json({ error: "参加可能な日時を1つ以上選んでください" }, { status: 400 });
    }

    const participant = addParticipant(slug, body);
    if (!participant) {
      return NextResponse.json(
        { error: "同じ名前と駅の参加者が既に登録されています" },
        { status: 409 }
      );
    }

    const event = getEventBySlug(slug);
    if (event) {
      await sendPushToEvent(event.id, {
        title: `${event.title} — 参加登録`,
        body: `${body.name.trim()}さんが参加登録しました`,
        url: absoluteAppUrl(`/e/${slug}?token=${event.edit_token}`),
      });
      await checkAndNotifyAllAnswered(slug);
    }

    return NextResponse.json({
      participant: {
        id: participant.id,
        name: participant.name,
        station: participant.station,
        availability: participant.availability,
        created_at: participant.created_at,
      },
      participant_token: participant.participant_token,
      edit_url: `/e/${slug}/edit?token=${participant.participant_token}`,
    });
  } catch {
    return NextResponse.json({ error: "参加登録に失敗しました" }, { status: 500 });
  }
}
