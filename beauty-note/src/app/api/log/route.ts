import { NextRequest, NextResponse } from "next/server";
import { createShiftLog, getShiftLogs, seedIfEmpty } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  seedIfEmpty();
  return NextResponse.json(getShiftLogs());
}

export async function POST(request: NextRequest) {
  try {
    seedIfEmpty();
    const body = await request.json();
    const log = createShiftLog({
      product_id: body.product_id ? Number(body.product_id) : null,
      learned_note: body.learned_note,
      struggled_ingredient: body.struggled_ingredient,
    });
    return NextResponse.json(log, { status: 201 });
  } catch {
    return NextResponse.json({ error: "記録に失敗しました" }, { status: 500 });
  }
}
