import { NextResponse } from "next/server";
import { createComment, getCommentsBySubmission } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const comments = getCommentsBySubmission(Number(id));
  return NextResponse.json(comments);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "ニックネームを設定するか、Googleでログインしてください" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const body = await request.json();
  const text = (body.body as string)?.trim();
  if (!text || text.length > 1000) {
    return NextResponse.json(
      { error: "コメントは1〜1000文字で入力してください" },
      { status: 400 },
    );
  }

  const comment = createComment(Number(id), user.id, text);
  if (!comment) {
    return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
  }
  return NextResponse.json(comment, { status: 201 });
}
