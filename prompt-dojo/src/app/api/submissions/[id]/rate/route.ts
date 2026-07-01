import { NextResponse } from "next/server";
import { ApiErrorCode, apiError, type ApiErrorCodeType } from "@/lib/api-errors";
import { getSubmissionOwnerId, rateSubmission } from "@/lib/db";
import { sendLocalizedPush } from "@/lib/push-messages";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

const RATE_ERROR_CODES = new Set<ApiErrorCodeType>([
  ApiErrorCode.SUBMISSION_NOT_FOUND,
  ApiErrorCode.CANNOT_RATE_OWN,
  ApiErrorCode.INVALID_RATING,
]);

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
    const code =
      result.error && RATE_ERROR_CODES.has(result.error as ApiErrorCodeType)
        ? (result.error as ApiErrorCodeType)
        : ApiErrorCode.GENERIC_ERROR;
    return apiError(code, 400);
  }

  const ownerId = getSubmissionOwnerId(submissionId);
  if (ownerId && ownerId !== user.id) {
    void sendLocalizedPush(
      ownerId,
      "rating",
      { name: user.display_name ?? "", stars },
      `/submissions/${submissionId}`,
    );
  }

  return NextResponse.json({ submission: result.submission });
}
