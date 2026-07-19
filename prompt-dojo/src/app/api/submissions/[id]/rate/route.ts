import { NextResponse } from "next/server";
import { ApiErrorCode, apiError } from "@/lib/api-errors";
import { getSubmissionOwnerId, rateSubmission } from "@/lib/db";
import { sendPushToUser } from "@/lib/push";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

const RATE_ERROR_CODES: Record<string, (typeof ApiErrorCode)[keyof typeof ApiErrorCode]> = {
  "投稿が見つかりません": ApiErrorCode.SUBMISSION_NOT_FOUND,
  "自分の投稿は評価できません": ApiErrorCode.CANNOT_RATE_OWN,
  "評価は1〜5の星で行ってください": ApiErrorCode.INVALID_RATING,
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(ApiErrorCode.AUTH_REQUIRED, 401);
  }

  const { id } = await params;
  const submissionId = Number(id);
  const body = await request.json();
  const stars = Number(body.stars);

  const result = rateSubmission(submissionId, user.id, stars);
  if (!result.ok) {
    const code = RATE_ERROR_CODES[result.error ?? ""] ?? ApiErrorCode.GENERIC_ERROR;
    return apiError(code, 400);
  }

  const ownerId = getSubmissionOwnerId(submissionId);
  if (ownerId && ownerId !== user.id) {
    void sendPushToUser(ownerId, {
      title: "新しい評価",
      body: `${user.display_name}さんが★${stars}で評価しました`,
      url: `/submissions/${submissionId}`,
    });
  }

  return NextResponse.json({ submission: result.submission });
}
