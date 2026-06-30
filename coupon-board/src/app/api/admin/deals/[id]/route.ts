import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin";
import { deleteDeal, setDealHidden } from "@/lib/db";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();

  if (body.action === "hide") {
    setDealHidden(Number(id), true);
    return NextResponse.json({ ok: true });
  }
  if (body.action === "unhide") {
    setDealHidden(Number(id), false);
    return NextResponse.json({ ok: true });
  }
  if (body.action === "delete") {
    deleteDeal(Number(id));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "不正な操作です" }, { status: 400 });
}
