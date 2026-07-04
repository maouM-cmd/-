import { NextResponse } from "next/server";
import { areMutualUsers, getMessages, getProfileByUserId, getUserById, sendMessage } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { userId } = await params;
  const otherUserId = Number(userId);
  if (!otherUserId || !areMutualUsers(user.id, otherUserId)) {
    return NextResponse.json({ error: "not_allowed" }, { status: 403 });
  }

  const messages = getMessages(user.id, otherUserId);
  const otherUser = getUserById(otherUserId);
  const otherProfile = getProfileByUserId(otherUserId);

  return NextResponse.json({
    messages,
    other: {
      user_id: otherUserId,
      display_name: otherUser?.display_name,
      profile_name: otherProfile?.name,
      photo_path: otherProfile?.photo_path,
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { userId } = await params;
  const otherUserId = Number(userId);
  const body = await request.json();
  const text = (body.body ?? body.message ?? "").trim();

  if (!text) {
    return NextResponse.json({ error: "メッセージを入力してください" }, { status: 400 });
  }

  const message = sendMessage(user.id, otherUserId, text);
  if (!message) {
    return NextResponse.json({ error: "送信できません（マッチしていない可能性）" }, { status: 403 });
  }

  return NextResponse.json({ message });
}
