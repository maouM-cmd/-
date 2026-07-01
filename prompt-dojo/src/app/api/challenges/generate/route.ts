import { NextResponse } from "next/server";
import { generateChallengeWithLLM, isChallengeGenEnabled } from "@/lib/llm-challenge-generator";
import { checkAndIncrementChallengeGenLimit } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  if (!isChallengeGenEnabled()) {
    return NextResponse.json(
      { error: "AI課題生成は現在利用できません（OPENAI_API_KEY未設定）" },
      { status: 503 },
    );
  }

  const limit = checkAndIncrementChallengeGenLimit(user.id);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "本日のAI課題生成上限に達しました" },
      { status: 429 },
    );
  }

  const body = await request.json();
  const theme = (body.theme as string)?.trim();
  const difficulty = (body.difficulty as "beginner" | "intermediate" | "advanced") ?? "intermediate";

  if (!theme || theme.length > 100) {
    return NextResponse.json({ error: "テーマは1〜100文字で入力してください" }, { status: 400 });
  }

  const challenge = await generateChallengeWithLLM(theme, difficulty);
  if (!challenge) {
    return NextResponse.json({ error: "課題の生成に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ challenge, remaining: limit.remaining });
}
