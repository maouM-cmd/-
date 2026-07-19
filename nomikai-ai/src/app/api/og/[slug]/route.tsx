import { ImageResponse } from "next/og";
import { MOOD_OPTIONS, SITE_NAME } from "@/lib/constants";
import { getEventDetail } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const detail = getEventDetail(slug);

  if (!detail) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fef3c7",
            fontSize: 48,
            color: "#92400e",
          }}
        >
          イベントが見つかりません
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const { event, participants } = detail;
  const mood = MOOD_OPTIONS.find((m) => m.value === event.mood);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: 28, color: "#92400e", fontWeight: 600 }}>{SITE_NAME}</div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#1f2937",
              lineHeight: 1.2,
              maxWidth: "1000px",
            }}
          >
            {event.title}
          </div>
        </div>
        <div style={{ display: "flex", gap: "32px", fontSize: 32, color: "#374151" }}>
          <span>幹事: {event.organizer_name}</span>
          <span>参加者 {participants.length}人</span>
          <span>
            {mood?.emoji} {mood?.label}
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
