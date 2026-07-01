import { NextResponse } from "next/server";
import {
  getAdminClearCookie,
  getAdminSessionCookie,
  verifyAdminPassword,
} from "@/lib/admin";
import {
  createChallenge,
  deleteChallenge,
  getAllChallengesAdmin,
  updateChallenge,
} from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const challenges = getAllChallengesAdmin();
  return NextResponse.json({ challenges });
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

  const { isAdminAuthenticated } = await import("@/lib/admin");
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

  if (body.action === "delete") {
    const ok = deleteChallenge(Number(body.id));
    if (!ok) {
      return NextResponse.json({ error: "課題が見つかりません" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
