import { NextResponse } from "next/server";
import { ApiErrorCode, apiError } from "@/lib/api-errors";
import { generateChallengeWithLLM, isChallengeGenEnabled } from "@/lib/llm-challenge-generator";
import { checkAndIncrementChallengeGenLimit } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(ApiErrorCode.AUTH_REQUIRED, 401);
  }

  if (!isChallengeGenEnabled()) {
    return apiError(ApiErrorCode.CHALLENGE_GEN_DISABLED, 503);
  }

  const limit = checkAndIncrementChallengeGenLimit(user.id);
  if (!limit.allowed) {
    return apiError(ApiErrorCode.CHALLENGE_GEN_LIMIT_REACHED, 429);
  }

  const body = await request.json();
  const theme = (body.theme as string)?.trim();
  const difficulty = (body.difficulty as "beginner" | "intermediate" | "advanced") ?? "intermediate";

  if (!theme || theme.length > 100) {
    return apiError(ApiErrorCode.INVALID_THEME, 400);
  }

  const locale = (body.locale as string) === "en" ? "en" : user.preferred_locale === "en" ? "en" : "ja";

  const challenge = await generateChallengeWithLLM(theme, difficulty, locale);
  if (!challenge) {
    return apiError(ApiErrorCode.CHALLENGE_GEN_FAILED, 500);
  }

  return NextResponse.json({ challenge, remaining: limit.remaining });
}
