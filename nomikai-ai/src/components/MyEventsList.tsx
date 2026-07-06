import Link from "next/link";
import type { UserEventSummary } from "@/lib/types";

export function MyEventsList({ events }: { events: UserEventSummary[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-white p-6 text-center">
        <p className="text-gray-600">まだ飲み会がありません。</p>
        <Link
          href="/create"
          className="mt-4 inline-flex min-h-[44px] items-center rounded-xl bg-amber-500 px-6 text-white hover:bg-amber-600"
        >
          飲み会を作る
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {events.map(({ event, participant_count, has_plan, expired }) => (
        <li key={event.id}>
          <Link
            href={`/e/${event.slug}?token=${event.edit_token}`}
            className={`block rounded-2xl border p-4 shadow-sm transition hover:shadow-md ${
              expired
                ? "border-gray-200 bg-gray-50 opacity-75"
                : "border-amber-100 bg-white hover:border-amber-200"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-bold text-gray-900">{event.title}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  参加者 {participant_count}人
                  {has_plan && " · プラン済"}
                  {expired && " · 終了"}
                </p>
              </div>
              <span className="text-amber-400">→</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
