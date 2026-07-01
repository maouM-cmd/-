import { NextResponse } from "next/server";
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
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const challenge = getChallengeById(challengeId);
  if (!challenge) {
    return NextResponse.json({ error: "課題が見つかりません" }, { status: 404 });
  }

  const user = await getCurrentUser();
  const submissions = getSubmissionsByChallenge(challengeId, user?.id);
  return NextResponse.json({ challenge, submissions });
}
