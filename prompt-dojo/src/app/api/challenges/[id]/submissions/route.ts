import { NextResponse } from "next/server";
import { apiError, ApiErrorCode } from "@/lib/api-errors";
import { isEmailVerified } from "@/lib/auth-checks";
import { createSubmission, getChallengeById } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(ApiErrorCode.AUTH_REQUIRED, 401);
  }

  if (!isEmailVerified(user)) {
    return apiError(ApiErrorCode.EMAIL_NOT_VERIFIED, 403);
  }

  const { id } = await params;
  const challengeId = Number(id);
  const challenge = getChallengeById(challengeId);
  if (!challenge) {
    return apiError(ApiErrorCode.CHALLENGE_NOT_FOUND, 404);
  }

  const body = await request.json();
  const promptText = (body.prompt_text as string)?.trim();
  if (!promptText || promptText.length < 10) {
    return apiError(ApiErrorCode.INVALID_PROMPT, 400);
  }
  if (promptText.length > 5000) {
    return apiError(ApiErrorCode.INVALID_PROMPT_TOO_LONG, 400);
  }

  const submission = await createSubmission(challengeId, user.id, promptText);
  return NextResponse.json({ submission }, { status: 201 });
}
