import { NextRequest, NextResponse } from "next/server";
import { createCoupon, getAllCoupons, seedIfEmpty } from "@/lib/db";
import type { Category } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  seedIfEmpty();

  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") as Category | null;
  const search = searchParams.get("search") ?? undefined;
  const sort = (searchParams.get("sort") as "new" | "popular") ?? "new";

  const coupons = getAllCoupons({
    category: category ?? undefined,
    search,
    sort,
  });

  return NextResponse.json(coupons);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.service_name?.trim()) {
      return NextResponse.json(
        { error: "サービス名は必須です" },
        { status: 400 }
      );
    }
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "タイトルは必須です" }, { status: 400 });
    }
    if (!body.discount?.trim()) {
      return NextResponse.json(
        { error: "割引内容は必須です" },
        { status: 400 }
      );
    }
    if (!body.url?.trim()) {
      return NextResponse.json({ error: "URLは必須です" }, { status: 400 });
    }

    const coupon = createCoupon({
      service_name: body.service_name,
      title: body.title,
      description: body.description ?? "",
      coupon_code: body.coupon_code,
      discount: body.discount,
      url: body.url,
      category: body.category ?? "other",
      expires_at: body.expires_at,
      author_name: body.author_name ?? "匿名",
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "投稿に失敗しました" },
      { status: 500 }
    );
  }
}
