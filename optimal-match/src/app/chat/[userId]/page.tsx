import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatRoom } from "@/components/ChatRoom";
import { Avatar } from "@/components/Avatar";
import { areMutualUsers, getProfileByUserId, getUserById } from "@/lib/db";
import { requireUser } from "@/lib/session";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const user = await requireUser();
  const { userId } = await params;
  const otherUserId = Number(userId);

  if (!otherUserId || !areMutualUsers(user.id, otherUserId)) {
    notFound();
  }

  const otherUser = getUserById(otherUserId);
  const otherProfile = getProfileByUserId(otherUserId);
  const name = otherProfile?.name ?? otherUser?.display_name ?? "相手";

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-4 flex items-center gap-3">
        <Link href="/chat" className="text-sm text-rose-500 hover:underline">
          ← 一覧
        </Link>
        <Avatar name={name} photoPath={otherProfile?.photo_path} size="sm" />
        <div>
          <h1 className="font-bold text-gray-900">{name}</h1>
          <p className="text-xs text-emerald-600">マッチ成立中</p>
        </div>
      </div>
      <ChatRoom otherUserId={otherUserId} myUserId={user.id} otherName={name} />
    </div>
  );
}
