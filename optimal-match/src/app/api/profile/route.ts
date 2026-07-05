import { NextResponse } from "next/server";
import { getProfileByUserId, upsertUserProfile } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { CreateProfileInput } from "@/lib/types";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const profile = getProfileByUserId(user.id);
  return NextResponse.json({ profile, user: { display_name: user.display_name } });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const body = (await request.json()) as CreateProfileInput;
  if (!body.name?.trim() || !body.interests?.length) {
    return NextResponse.json({ error: "名前と興味を1つ以上入力してください" }, { status: 400 });
  }

  const profile = upsertUserProfile(user.id, { ...body, sincerity: body.sincerity ?? 3 });
  return NextResponse.json({ profile });
}
