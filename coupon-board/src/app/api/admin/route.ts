import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin";
import { getAllDealsForAdmin, getAllReports } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  return NextResponse.json({
    deals: getAllDealsForAdmin(),
    reports: getAllReports(),
  });
}
