import { NextRequest, NextResponse } from "next/server";
import {
  createProduct,
  getAllProducts,
  getPinnedProducts,
  seedIfEmpty,
} from "@/lib/db";
import type { ProductCategory } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  seedIfEmpty();
  const { searchParams } = request.nextUrl;
  const pinnedOnly = searchParams.get("pinned") === "1";
  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") as ProductCategory | null;

  const products = pinnedOnly
    ? getPinnedProducts()
    : getAllProducts({
        search,
        category: category ?? undefined,
      });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try {
    seedIfEmpty();
    const body = await request.json();

    if (!body.brand?.trim() || !body.name?.trim()) {
      return NextResponse.json(
        { error: "ブランド名と商品名は必須です" },
        { status: 400 }
      );
    }

    const product = createProduct({
      brand: body.brand,
      name: body.name,
      shade: body.shade,
      category: body.category ?? "other",
      key_ingredients: body.key_ingredients ?? [],
      ingredient_tags: body.ingredient_tags ?? [],
      skin_types: body.skin_types ?? [],
      avoid_for: body.avoid_for,
      talking_points: body.talking_points,
      notes: body.notes,
      is_pinned: Boolean(body.is_pinned),
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "商品の登録に失敗しました";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
