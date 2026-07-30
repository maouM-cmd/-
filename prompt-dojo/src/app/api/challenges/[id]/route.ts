import { NextResponse } from "next/server";
import { ApiErrorCode, apiError } from "@/lib/api-errors";
import { getChallengeById, getSubmissionsByChallenge } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const challengeId = Number(id);
  if (Number.isNaN(challengeId)) {
    return apiError(ApiErrorCode.INVALID_ID, 400);
  }

  const challenge = getChallengeById(challengeId);
  if (!challenge) {
    return apiError(ApiErrorCode.CHALLENGE_NOT_FOUND, 404);
  }

  const user = await getCurrentUser();
  const submissions = getSubmissionsByChallenge(challengeId, user?.id);
  return NextResponse.json({ challenge, submissions });
}
