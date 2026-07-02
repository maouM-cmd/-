import { NextRequest, NextResponse } from "next/server";
import { exportAllData, getSettings, seedIfEmpty, updateSettings } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  seedIfEmpty();
  const { searchParams } = request.nextUrl;
  if (searchParams.get("export") === "1") {
    return NextResponse.json(exportAllData());
  }
  return NextResponse.json(getSettings());
}

export async function PATCH(request: NextRequest) {
  try {
    seedIfEmpty();
    const body = await request.json();
    const settings = updateSettings(body);
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "設定の更新に失敗しました" }, { status: 500 });
  }
}
