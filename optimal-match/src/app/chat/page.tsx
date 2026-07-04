import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { getChatThreads } from "@/lib/db";
import { requireUser } from "@/lib/session";

export default async function ChatListPage() {
  const user = await requireUser();
  const threads = getChatThreads(user.id);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">チャット</h1>
      <p className="mt-2 text-sm text-gray-500">
        マッチ成立した相手とだけメッセージできます
      </p>

      {threads.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">まだチャットできる相手がいません</p>
          <p className="mt-2 text-xs text-gray-400">
            実ユーザー同士でお互いにいいねするとマッチ成立します
          </p>
          <Link href="/matches" className="mt-4 inline-block text-rose-600 underline text-sm">
            マッチ一覧へ
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {threads.map((t) => (
            <Link
              key={t.other_user_id}
              href={`/chat/${t.other_user_id}`}
              className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm transition hover:border-rose-300"
            >
              <Avatar name={t.other_name} photoPath={t.other_photo} />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900">{t.other_name}</p>
                <p className="truncate text-sm text-gray-500">
                  {t.last_message ?? "メッセージを送ってみましょう"}
                </p>
              </div>
              {t.last_at && (
                <span className="text-xs text-gray-400">{t.last_at.slice(5, 16)}</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
