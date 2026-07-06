import { NextResponse } from "next/server";
import { addParticipant } from "@/lib/db";
import type { JoinEventInput } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
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

    return NextResponse.json({ participant });
  } catch {
    return NextResponse.json({ error: "参加登録に失敗しました" }, { status: 500 });
  }
}
