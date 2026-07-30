import { NextRequest, NextResponse } from "next/server";
import {
  deleteProduct,
  getProductById,
  seedIfEmpty,
  togglePin,
  updateProduct,
} from "@/lib/db";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  seedIfEmpty();
  const { id } = await context.params;
  const productId = Number(id);
  const product = getProductById(productId);

  if (!product) {
    return NextResponse.json({ error: "商品が見つかりません" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    seedIfEmpty();
    const { id } = await context.params;
    const productId = Number(id);
    const body = await request.json();

    if (body.action === "toggle_pin") {
      const product = togglePin(productId);
      if (!product) {
        return NextResponse.json({ error: "商品が見つかりません" }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    const product = updateProduct(productId, body);
    if (!product) {
      return NextResponse.json({ error: "商品が見つかりません" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "更新に失敗しました";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  seedIfEmpty();
  const { id } = await context.params;
  const productId = Number(id);
  const ok = deleteProduct(productId);

  if (!ok) {
    return NextResponse.json({ error: "商品が見つかりません" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
