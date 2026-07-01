import { NextResponse } from "next/server";
import { createSubmission, getChallengeById } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "ニックネームを設定してから投稿してください" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const challengeId = Number(id);
  const challenge = getChallengeById(challengeId);
  if (!challenge) {
    return NextResponse.json({ error: "課題が見つかりません" }, { status: 404 });
  }

  const body = await request.json();
  const promptText = (body.prompt_text as string)?.trim();
  if (!promptText || promptText.length < 10) {
    return NextResponse.json(
      { error: "プロンプトは10文字以上で入力してください" },
      { status: 400 },
    );
  }
  if (promptText.length > 5000) {
    return NextResponse.json(
      { error: "プロンプトは5000文字以内で入力してください" },
      { status: 400 },
    );
  }

  const submission = await createSubmission(challengeId, user.id, promptText);
  return NextResponse.json({ submission }, { status: 201 });
}
