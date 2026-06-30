import { NextRequest, NextResponse } from "next/server";
import { createComment, getCommentsByDealId } from "@/lib/db";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const comments = getCommentsByDealId(Number(id));
  return NextResponse.json(comments);
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (!body.body?.trim()) {
      return NextResponse.json(
        { error: "コメントを入力してください" },
        { status: 400 }
      );
    }

    const comment = createComment(
      Number(id),
      body.body,
      body.author_name
    );

    if (!comment) {
      return NextResponse.json(
        { error: "案件が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "コメントの投稿に失敗しました" },
      { status: 500 }
    );
  }
}
