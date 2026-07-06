import { NextResponse } from "next/server";
import { isEventExpired, verifyEditToken } from "@/lib/db";
import { absoluteAppUrl } from "@/lib/app-url";
import { generatePlan } from "@/lib/plan-service";
import { sendPushToParticipants } from "@/lib/push";

export const runtime = "nodejs";

export async function POST(
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
      return NextResponse.json({ error: "プラン生成に失敗しました" }, { status: 403 });
    }
    if (isEventExpired(event.expires_at)) {
      return NextResponse.json({ error: "この飲み会は終了しています" }, { status: 403 });
    }

    const plan = await generatePlan(slug, body.edit_token);
    if (!plan) {
      return NextResponse.json({ error: "プラン生成に失敗しました" }, { status: 403 });
    }

    void sendPushToParticipants(event.id, {
      title: `${event.title} — プラン確定`,
      body: `集合: ${plan.middle_station}`,
      url: absoluteAppUrl(`/e/${slug}`),
    });

    return NextResponse.json({ plan });
  } catch {
    return NextResponse.json({ error: "プラン生成中にエラーが発生しました" }, { status: 500 });
  }
}
