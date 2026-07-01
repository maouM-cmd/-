import { NextResponse } from "next/server";
import { createChallenge, getAllChallenges, seedIfEmpty } from "@/lib/db";
import { emailVerificationRequiredMessage, isEmailVerified } from "@/lib/auth-checks";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  seedIfEmpty();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const challenges = getAllChallenges({
    categorySlug: category,
    tagName: tag,
  });
  return NextResponse.json({ challenges });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "ニックネームを設定するか、Googleでログインしてください" },
      { status: 401 },
    );
  }

  if (!isEmailVerified(user)) {
    return NextResponse.json(
      { error: emailVerificationRequiredMessage() },
      { status: 403 },
    );
  }

  const body = await request.json();
  const title = (body.title as string)?.trim();
  const description = (body.description as string)?.trim();
  const sample_output = (body.sample_output as string)?.trim() ?? "";
  const category_id = body.category_id ? Number(body.category_id) : undefined;
  const tags = Array.isArray(body.tags)
    ? (body.tags as string[]).map((t) => String(t).trim()).filter(Boolean)
    : typeof body.tags === "string"
      ? (body.tags as string).split(",").map((t: string) => t.trim()).filter(Boolean)
      : undefined;

  if (!title || title.length > 100) {
    return NextResponse.json(
      { error: "タイトルは1〜100文字で入力してください" },
      { status: 400 },
    );
  }
  if (!description || description.length > 2000) {
    return NextResponse.json(
      { error: "説明は1〜2000文字で入力してください" },
      { status: 400 },
    );
  }

  const challenge = createChallenge({
    title,
    description,
    sample_output,
    status: "pending",
    author_id: user.id,
    category_id,
    tags,
  });

  return NextResponse.json(
    { challenge, message: "課題を投稿しました。管理者の承認後に公開されます。" },
    { status: 201 },
  );
}
