import { NextResponse } from "next/server";
import {
  createComment,
  getCommentsBySubmission,
  getSubmissionOwnerId,
} from "@/lib/db";
import { sendPushToUser } from "@/lib/push";
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
      { error: "ログインが必要です" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const submissionId = Number(id);
  const body = await request.json();
  const text = (body.body as string)?.trim();
  const parentId = body.parent_id ? Number(body.parent_id) : null;

  if (!text || text.length > 1000) {
    return NextResponse.json(
      { error: "コメントは1〜1000文字で入力してください" },
      { status: 400 },
    );
  }

  const comment = createComment(submissionId, user.id, text, parentId);
  if (!comment) {
    return NextResponse.json(
      { error: "投稿が見つからないか、返信先が無効です" },
      { status: 404 },
    );
  }

  const ownerId = getSubmissionOwnerId(submissionId);
  if (ownerId && ownerId !== user.id) {
    void sendPushToUser(ownerId, {
      title: "新しいコメント",
      body: `${user.display_name}さんがコメントしました`,
      url: `/submissions/${submissionId}`,
    });
  }

  return NextResponse.json(comment, { status: 201 });
}
