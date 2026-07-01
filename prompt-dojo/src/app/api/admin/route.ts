import { NextResponse } from "next/server";
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
  getPendingChallenges,
  setSubmissionHidden,
  updateChallenge,
} from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
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
      return NextResponse.json({ error: "パスワードが違います" }, { status: 401 });
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
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  if (body.action === "create") {
    const challenge = createChallenge({
      title: body.title,
      description: body.description,
      sample_output: body.sample_output,
      status: body.status,
    });
    return NextResponse.json({ challenge }, { status: 201 });
  }

  if (body.action === "update") {
    const challenge = updateChallenge(Number(body.id), {
      title: body.title,
      description: body.description,
      sample_output: body.sample_output,
      status: body.status,
    });
    if (!challenge) {
      return NextResponse.json({ error: "課題が見つかりません" }, { status: 404 });
    }
    return NextResponse.json({ challenge });
  }

  if (body.action === "approve") {
    const challenge = approveChallenge(Number(body.id));
    if (!challenge) {
      return NextResponse.json({ error: "承認できません" }, { status: 400 });
    }
    return NextResponse.json({ challenge });
  }

  if (body.action === "delete") {
    const ok = deleteChallenge(Number(body.id));
    if (!ok) {
      return NextResponse.json({ error: "課題が見つかりません" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }

  if (body.action === "hide_submission") {
    const ok = setSubmissionHidden(Number(body.id), true);
    if (!ok) {
      return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }

  if (body.action === "restore_submission") {
    const ok = setSubmissionHidden(Number(body.id), false);
    if (!ok) {
      return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }

  if (body.action === "delete_submission") {
    const ok = deleteSubmission(Number(body.id));
    if (!ok) {
      return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
