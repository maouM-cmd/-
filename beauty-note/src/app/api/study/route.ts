import { NextRequest, NextResponse } from "next/server";
import { getStudyStats, recordStudy, seedIfEmpty } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  seedIfEmpty();
  return NextResponse.json(getStudyStats());
}

export async function POST(request: NextRequest) {
  try {
    seedIfEmpty();
    const body = await request.json();
    const productId = Number(body.product_id);
    const remembered = Boolean(body.remembered);

    if (!productId) {
      return NextResponse.json({ error: "商品IDが必要です" }, { status: 400 });
    }

    const product = recordStudy(productId, remembered);
    if (!product) {
      return NextResponse.json({ error: "商品が見つかりません" }, { status: 404 });
    }

    return NextResponse.json({
      product,
      stats: getStudyStats(),
    });
  } catch {
    return NextResponse.json({ error: "記録に失敗しました" }, { status: 500 });
  }
}
