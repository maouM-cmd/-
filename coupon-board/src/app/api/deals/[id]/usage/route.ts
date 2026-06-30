import { NextRequest, NextResponse } from "next/server";
import { incrementUsage } from "@/lib/db";
import type { UsageType } from "@/lib/types";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const type = body.type as UsageType;

    if (type !== "worked" && type !== "failed") {
      return NextResponse.json(
        { error: "不正なリクエストです" },
        { status: 400 }
      );
    }

    const deal = incrementUsage(Number(id), type);

    if (!deal) {
      return NextResponse.json(
        { error: "案件が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      worked_count: deal.worked_count,
      failed_count: deal.failed_count,
    });
  } catch {
    return NextResponse.json(
      { error: "報告に失敗しました" },
      { status: 500 }
    );
  }
}
