import { NextResponse } from "next/server";
import { apiError, ApiErrorCode } from "@/lib/api-errors";
import { REPORT_REASONS } from "@/lib/constants-reports";
import { createReport } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { ReportReason } from "@/lib/types";

export const runtime = "nodejs";

const VALID_REASONS = new Set(REPORT_REASONS);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(ApiErrorCode.AUTH_REQUIRED, 401);
  }

  const { id } = await params;
  const body = await request.json();
  const reason = body.reason as ReportReason;

  if (!reason || !VALID_REASONS.has(reason)) {
    return apiError(ApiErrorCode.INVALID_REPORT_REASON, 400);
  }

  const result = createReport(
    Number(id),
    user.id,
    reason,
    (body.detail as string) ?? "",
  );

  if (!result) {
    return apiError(ApiErrorCode.CANNOT_REPORT, 400);
  }

  return NextResponse.json({
    ok: true,
    hidden: result.hidden,
    messageCode: result.hidden ? "REPORT_ACCEPTED_HIDDEN" : "REPORT_ACCEPTED",
  });
}
