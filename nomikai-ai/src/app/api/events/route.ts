import { NextResponse } from "next/server";
import { createEvent } from "@/lib/db";
import type { CreateEventInput, Mood } from "@/lib/types";

export const runtime = "nodejs";

const VALID_MOODS = new Set<Mood>(["casual", "lively", "quiet", "celebration"]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateEventInput;

    if (!body.title?.trim() || !body.organizer_name?.trim()) {
      return NextResponse.json({ error: "タイトルと幹事名は必須です" }, { status: 400 });
    }
    if (!VALID_MOODS.has(body.mood)) {
      return NextResponse.json({ error: "雰囲気の指定が不正です" }, { status: 400 });
    }
    if (!body.budget || body.budget < 1000) {
      return NextResponse.json({ error: "予算を指定してください" }, { status: 400 });
    }
    if (!Array.isArray(body.date_options) || body.date_options.length === 0) {
      return NextResponse.json({ error: "日時候補を1つ以上指定してください" }, { status: 400 });
    }

    const event = createEvent(body);
    return NextResponse.json({
      slug: event.slug,
      edit_token: event.edit_token,
      share_url: `/e/${event.slug}`,
      organizer_url: `/e/${event.slug}?token=${event.edit_token}`,
    });
  } catch {
    return NextResponse.json({ error: "イベントの作成に失敗しました" }, { status: 500 });
  }
}
