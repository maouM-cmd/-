import { NextResponse } from "next/server";
import { getEventDetail } from "@/lib/db";

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

  const { event, participants, plan } = detail;
  return NextResponse.json({
    event: {
      slug: event.slug,
      title: event.title,
      organizer_name: event.organizer_name,
      budget: event.budget,
      mood: event.mood,
      date_options: event.date_options,
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
  });
}
