import { NextRequest, NextResponse } from "next/server";
import { createDeal, getAllDeals, seedIfEmpty } from "@/lib/db";
import { saveScreenshot } from "@/lib/upload";
import type { Category, SortOption } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  seedIfEmpty();

  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") as Category | null;
  const search = searchParams.get("search") ?? undefined;
  const sort = (searchParams.get("sort") as SortOption) ?? "new";

  const deals = getAllDeals({
    category: category ?? undefined,
    search,
    sort,
  });

  return NextResponse.json(deals);
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let body: Record<string, string>;
    let screenshotFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = Object.fromEntries(
        [...formData.entries()]
          .filter(([, v]) => typeof v === "string")
          .map(([k, v]) => [k, v as string])
      );
      const file = formData.get("screenshot");
      if (file instanceof File && file.size > 0) {
        screenshotFile = file;
      }
    } else {
      body = await request.json();
    }

    if (!body.service_name?.trim()) {
      return NextResponse.json(
        { error: "サービス名は必須です" },
        { status: 400 }
      );
    }
    if (!body.referrer_reward?.trim()) {
      return NextResponse.json(
        { error: "紹介者特典は必須です" },
        { status: 400 }
      );
    }
    if (!body.referee_reward?.trim()) {
      return NextResponse.json(
        { error: "被紹介者特典は必須です" },
        { status: 400 }
      );
    }
    if (!body.referral_link?.trim() && !body.referral_code?.trim()) {
      return NextResponse.json(
        { error: "招待リンクまたは招待コードのどちらかは必須です" },
        { status: 400 }
      );
    }

    let screenshot_path: string | undefined;
    if (screenshotFile) {
      try {
        screenshot_path = await saveScreenshot(screenshotFile);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "画像のアップロードに失敗しました";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }

    const deal = createDeal({
      service_name: body.service_name,
      referrer_reward: body.referrer_reward,
      referee_reward: body.referee_reward,
      referrer_reward_value: body.referrer_reward_value
        ? Number(body.referrer_reward_value)
        : undefined,
      referee_reward_value: body.referee_reward_value
        ? Number(body.referee_reward_value)
        : undefined,
      referral_link: body.referral_link,
      referral_code: body.referral_code,
      conditions: body.conditions ?? "",
      description: body.description ?? "",
      category: (body.category as Category) ?? "other",
      expires_at: body.expires_at,
      author_name: body.author_name ?? "匿名",
      screenshot_path,
    });

    return NextResponse.json(deal, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "投稿に失敗しました" },
      { status: 500 }
    );
  }
}
