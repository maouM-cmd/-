import { NextResponse } from "next/server";
import { REPORT_REASONS } from "@/lib/constants-reports";
import { createReport } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { ReportReason } from "@/lib/types";

export const runtime = "nodejs";

const VALID_REASONS = new Set(REPORT_REASONS.map((r) => r.value));

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "ログインが必要です" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const body = await request.json();
  const reason = body.reason as ReportReason;

  if (!reason || !VALID_REASONS.has(reason)) {
    return NextResponse.json(
      { error: "通報理由を選択してください" },
      { status: 400 },
    );
  }

  const result = createReport(
    Number(id),
    user.id,
    reason,
    (body.detail as string) ?? "",
  );

  if (!result) {
    return NextResponse.json(
      { error: "通報できません（投稿が見つからないか、自分の投稿です）" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    hidden: result.hidden,
    message: result.hidden
      ? "通報を受け付けました。この投稿は非表示になりました。"
      : "通報を受け付けました。ご協力ありがとうございます。",
  });
}
