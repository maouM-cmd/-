import Link from "next/link";
import { MyEventsList } from "@/components/MyEventsList";
import { getEventsByUserId } from "@/lib/db";
import { requireUser } from "@/lib/session";

export default async function MyPage() {
  const user = await requireUser();
  const events = getEventsByUserId(user.id);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900">マイページ</h1>
      <p className="mt-2 text-sm text-gray-600">
        {user.display_name} さんの飲み会一覧
      </p>
      <div className="mt-6">
        <MyEventsList events={events} />
      </div>
      <Link
        href="/create"
        className="mt-6 flex min-h-[48px] w-full items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
      >
        + 新しい飲み会を作る
      </Link>
    </div>
  );
}
