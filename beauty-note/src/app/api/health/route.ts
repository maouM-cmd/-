import { NextResponse } from "next/server";
import { seedIfEmpty } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  seedIfEmpty();
  return NextResponse.json({ ok: true, service: "beauty-note" });
}
