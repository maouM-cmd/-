import { NextResponse } from "next/server";
import { ApiErrorCode, apiError } from "@/lib/api-errors";
import {
  getAdminClearCookie,
  getAdminSessionCookie,
  isAdminAuthenticated,
  verifyAdminPassword,
} from "@/lib/admin";
import {
  approveChallenge,
  createChallenge,
  deleteChallenge,
  deleteSubmission,
  getAllChallengesAdmin,
  getAllReports,
  getAllSubmissionsAdmin,
  getChallengeAuthorId,
  getPendingChallenges,
  setSubmissionHidden,
  updateChallenge,
} from "@/lib/db";
import { sendLocalizedPush } from "@/lib/push-messages";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return apiError(ApiErrorCode.ADMIN_AUTH_REQUIRED, 401);
  }
  return NextResponse.json({
    challenges: getAllChallengesAdmin(),
    pending: getPendingChallenges(),
    reports: getAllReports(),
    submissions: getAllSubmissionsAdmin(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (body.action === "login") {
    if (!verifyAdminPassword(body.password)) {
      return apiError(ApiErrorCode.ADMIN_WRONG_PASSWORD, 401);
    }
    const session = getAdminSessionCookie();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(session.name, session.value, session.options);
    return response;
  }

  if (body.action === "logout") {
    const clear = getAdminClearCookie();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(clear.name, clear.value, { maxAge: clear.maxAge, path: "/" });
    return response;
  }

  if (!(await isAdminAuthenticated())) {
    return apiError(ApiErrorCode.ADMIN_AUTH_REQUIRED, 401);
  }

  if (body.action === "create") {
    const tags = Array.isArray(body.tags)
      ? (body.tags as string[])
      : typeof body.tags === "string"
        ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : undefined;
    const challenge = createChallenge({
      title: body.title,
      description: body.description,
      sample_output: body.sample_output,
      status: body.status,
      category_id: body.category_id ? Number(body.category_id) : undefined,
      tags,
    });
    return NextResponse.json({ challenge }, { status: 201 });
  }

  if (body.action === "update") {
    const tags = Array.isArray(body.tags)
      ? (body.tags as string[])
      : typeof body.tags === "string"
        ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : body.tags === null
          ? []
          : undefined;
    const challenge = updateChallenge(Number(body.id), {
      title: body.title,
      description: body.description,
      sample_output: body.sample_output,
      status: body.status,
      category_id: body.category_id !== undefined ? Number(body.category_id) : undefined,
      tags,
    });
    if (!challenge) {
      return apiError(ApiErrorCode.CHALLENGE_NOT_FOUND, 404);
    }
    return NextResponse.json({ challenge });
  }

  if (body.action === "approve") {
    const challengeId = Number(body.id);
    const authorId = getChallengeAuthorId(challengeId);
    const challenge = approveChallenge(challengeId);
    if (!challenge) {
      return apiError(ApiErrorCode.APPROVE_FAILED, 400);
    }
    if (authorId) {
      void sendLocalizedPush(
        authorId,
        "challengeApproved",
        { title: challenge.title },
        `/challenges/${challenge.id}`,
      );
    }
    return NextResponse.json({ challenge });
  }

  if (body.action === "delete") {
    const ok = deleteChallenge(Number(body.id));
    if (!ok) {
      return apiError(ApiErrorCode.CHALLENGE_NOT_FOUND, 404);
    }
    return NextResponse.json({ ok: true });
  }

  if (body.action === "hide_submission") {
    const ok = setSubmissionHidden(Number(body.id), true);
    if (!ok) {
      return apiError(ApiErrorCode.SUBMISSION_NOT_FOUND, 404);
    }
    return NextResponse.json({ ok: true });
  }

  if (body.action === "restore_submission") {
    const ok = setSubmissionHidden(Number(body.id), false);
    if (!ok) {
      return apiError(ApiErrorCode.SUBMISSION_NOT_FOUND, 404);
    }
    return NextResponse.json({ ok: true });
  }

  if (body.action === "delete_submission") {
    const ok = deleteSubmission(Number(body.id));
    if (!ok) {
      return apiError(ApiErrorCode.SUBMISSION_NOT_FOUND, 404);
    }
    return NextResponse.json({ ok: true });
  }

  return apiError(ApiErrorCode.UNKNOWN_ACTION, 400);
}
