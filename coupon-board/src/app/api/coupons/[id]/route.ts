import { NextRequest, NextResponse } from "next/server";
import { getCouponById, incrementHelpful, seedIfEmpty } from "@/lib/db";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  seedIfEmpty();
  const { id } = await context.params;
  const coupon = getCouponById(Number(id));

  if (!coupon) {
    return NextResponse.json(
      { error: "クーポンが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(coupon);
}

export async function PATCH(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const coupon = incrementHelpful(Number(id));

  if (!coupon) {
    return NextResponse.json(
      { error: "クーポンが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(coupon);
}
