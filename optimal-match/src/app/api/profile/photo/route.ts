import { NextResponse } from "next/server";
import { updateProfilePhoto, getProfileByUserId } from "@/lib/db";
import { saveAvatar } from "@/lib/upload";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const profile = getProfileByUserId(user.id);
  if (!profile) {
    return NextResponse.json({ error: "先にプロフィールを作成してください" }, { status: 400 });
  }

  const form = await request.formData();
  const file = form.get("photo");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "画像ファイルを選択してください" }, { status: 400 });
  }

  try {
    const filename = await saveAvatar(file);
    const updated = updateProfilePhoto(user.id, filename);
    return NextResponse.json({ profile: updated, photo_url: `/api/uploads/${encodeURIComponent(filename)}` });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "アップロード失敗" },
      { status: 400 }
    );
  }
}
