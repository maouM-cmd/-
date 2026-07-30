import { NextRequest, NextResponse } from "next/server";
import { createFaq, getAllFaq, seedIfEmpty } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  seedIfEmpty();
  return NextResponse.json(getAllFaq());
}

export async function POST(request: NextRequest) {
  try {
    seedIfEmpty();
    const body = await request.json();
    if (!body.question?.trim() || !body.answer?.trim()) {
      return NextResponse.json(
        { error: "質問と回答は必須です" },
        { status: 400 }
      );
    }
    const faq = createFaq(body.question, body.answer, body.sort_order);
    return NextResponse.json(faq, { status: 201 });
  } catch {
    return NextResponse.json({ error: "登録に失敗しました" }, { status: 500 });
  }
}
