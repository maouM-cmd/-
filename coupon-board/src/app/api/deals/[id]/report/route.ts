import { NextRequest, NextResponse } from "next/server";
import { createReport } from "@/lib/db";
import { REPORT_REASONS } from "@/lib/constants-reports";
import type { ReportReason } from "@/lib/types";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

const VALID_REASONS = new Set(REPORT_REASONS.map((r) => r.value));

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const reason = body.reason as ReportReason;
    if (!reason || !VALID_REASONS.has(reason)) {
      return NextResponse.json(
        { error: "通報理由を選択してください" },
        { status: 400 }
      );
    }

    const result = createReport(Number(id), reason, body.detail);

    if (!result) {
      return NextResponse.json(
        { error: "案件が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      hidden: result.hidden,
      message: result.hidden
        ? "通報を受け付けました。この案件は非表示になりました。"
        : "通報を受け付けました。ご協力ありがとうございます。",
    });
  } catch {
    return NextResponse.json(
      { error: "通報に失敗しました" },
      { status: 500 }
    );
  }
}
