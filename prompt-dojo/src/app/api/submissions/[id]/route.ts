import { NextResponse } from "next/server";
import { ApiErrorCode, apiError } from "@/lib/api-errors";
import { getSubmissionById } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const submissionId = Number(id);
  const user = await getCurrentUser();
  const submission = getSubmissionById(submissionId, user?.id);
  if (!submission) {
    return apiError(ApiErrorCode.SUBMISSION_NOT_FOUND, 404);
  }
  return NextResponse.json({ submission });
}
