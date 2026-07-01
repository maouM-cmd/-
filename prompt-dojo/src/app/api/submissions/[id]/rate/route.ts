import { NextResponse } from "next/server";
import { rateSubmission } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "ニックネームを設定してから評価してください" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const submissionId = Number(id);
  const body = await request.json();
  const stars = Number(body.stars);

  const result = rateSubmission(submissionId, user.id, stars);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ submission: result.submission });
}
