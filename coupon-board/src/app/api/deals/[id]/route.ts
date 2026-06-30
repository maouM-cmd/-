import { NextRequest, NextResponse } from "next/server";
import { getDealById, incrementHelpful, seedIfEmpty } from "@/lib/db";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  seedIfEmpty();
  const { id } = await context.params;
  const deal = getDealById(Number(id));

  if (!deal) {
    return NextResponse.json(
      { error: "案件が見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(deal);
}

export async function PATCH(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const deal = incrementHelpful(Number(id));

  if (!deal) {
    return NextResponse.json(
      { error: "案件が見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(deal);
}
