import { NextResponse } from "next/server";
import { getAllCategories } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ categories: getAllCategories() });
}
