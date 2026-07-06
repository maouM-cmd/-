import { NextResponse } from "next/server";
import {
  deleteParticipant,
  getEventBySlug,
  isEventExpired,
  updateParticipant,
} from "@/lib/db";
import type { UpdateParticipantInput } from "@/lib/types";

export const runtime = "nodejs";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await params;
  const participantId = Number(id);
  if (!participantId) {
    return NextResponse.json({ error: "無効な参加者IDです" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as UpdateParticipantInput & {
      participant_token?: string;
    };

    if (!body.participant_token) {
      return NextResponse.json({ error: "参加者トークンが必要です" }, { status: 401 });
    }
    if (!body.name?.trim() || !body.station?.trim()) {
      return NextResponse.json({ error: "名前と最寄駅は必須です" }, { status: 400 });
    }
    if (!Array.isArray(body.availability) || body.availability.length === 0) {
      return NextResponse.json({ error: "参加可能な日時を1つ以上選んでください" }, { status: 400 });
    }

    const event = getEventBySlug(slug);
    if (!event) {
      return NextResponse.json({ error: "イベントが見つかりません" }, { status: 404 });
    }
    if (isEventExpired(event.expires_at)) {
      return NextResponse.json({ error: "この飲み会は終了しています" }, { status: 403 });
    }

    const participant = updateParticipant(slug, participantId, body.participant_token, {
      name: body.name,
      station: body.station,
      availability: body.availability,
    });

    if (!participant) {
      return NextResponse.json({ error: "更新に失敗しました" }, { status: 403 });
    }

    return NextResponse.json({ participant });
  } catch {
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await params;
  const participantId = Number(id);
  if (!participantId) {
    return NextResponse.json({ error: "無効な参加者IDです" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as {
      participant_token?: string;
      edit_token?: string;
    };

    const ok = deleteParticipant(slug, participantId, {
      participant_token: body.participant_token,
      edit_token: body.edit_token,
    });

    if (!ok) {
      return NextResponse.json({ error: "削除に失敗しました" }, { status: 403 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
