import { NextResponse } from "next/server";
import { apiError, ApiErrorCode } from "@/lib/api-errors";
import { isEmailVerified } from "@/lib/auth-checks";
import {
  createComment,
  getCommentsBySubmission,
  getSubmissionOwnerId,
} from "@/lib/db";
import { sendLocalizedPush } from "@/lib/push-messages";
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
    return apiError(ApiErrorCode.AUTH_REQUIRED, 401);
  }

  if (!isEmailVerified(user)) {
    return apiError(ApiErrorCode.EMAIL_NOT_VERIFIED, 403);
  }

  const { id } = await params;
  const submissionId = Number(id);
  const body = await request.json();
  const text = (body.body as string)?.trim();
  const parentId = body.parent_id ? Number(body.parent_id) : null;

  if (!text || text.length > 1000) {
    return apiError(ApiErrorCode.INVALID_COMMENT, 400);
  }

  const comment = createComment(submissionId, user.id, text, parentId);
  if (!comment) {
    return apiError(ApiErrorCode.COMMENT_TARGET_INVALID, 404);
  }

  const ownerId = getSubmissionOwnerId(submissionId);
  if (ownerId && ownerId !== user.id) {
    void sendLocalizedPush(
      ownerId,
      "comment",
      { name: user.display_name ?? "" },
      `/submissions/${submissionId}`,
    );
  }

  return NextResponse.json(comment, { status: 201 });
}
