import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db";
import type { LeaderboardType } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const type = (request.nextUrl.searchParams.get("type") ?? "total") as LeaderboardType;
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 50);
  const entries = getLeaderboard(type, limit);
  return NextResponse.json({ entries, type });
}
