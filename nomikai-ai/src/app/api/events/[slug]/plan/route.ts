import { NextResponse } from "next/server";
import { generatePlan } from "@/lib/plan-service";

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

    const plan = await generatePlan(slug, body.edit_token);
    if (!plan) {
      return NextResponse.json({ error: "プラン生成に失敗しました" }, { status: 403 });
    }

    return NextResponse.json({ plan });
  } catch {
    return NextResponse.json({ error: "プラン生成中にエラーが発生しました" }, { status: 500 });
  }
}
