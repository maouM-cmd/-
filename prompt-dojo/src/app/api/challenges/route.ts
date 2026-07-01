import { NextResponse } from "next/server";
import { getAllChallenges, seedIfEmpty } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  seedIfEmpty();
  const challenges = getAllChallenges();
  return NextResponse.json({ challenges });
}
