import { NextResponse } from "next/server";
import { getAllTags } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ tags: getAllTags() });
}
