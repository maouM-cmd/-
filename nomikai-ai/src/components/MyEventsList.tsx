"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserEventSummary } from "@/lib/types";

export function MyEventsList({ events }: { events: UserEventSummary[] }) {
  const router = useRouter();
  const [cloningSlug, setCloningSlug] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function cloneEvent(slug: string, editToken: string) {
    setCloningSlug(slug);
    setError("");

    try {
      const res = await fetch(`/api/events/${slug}/clone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edit_token: editToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "複製に失敗しました");
        return;
      }
      router.push(`/e/${data.slug}?token=${data.edit_token}`);
      router.refresh();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setCloningSlug(null);
    }
  }

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
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ul className="space-y-3">
        {events.map(({ event, participant_count, has_plan, expired }) => (
          <li key={event.id}>
            <div
              className={`rounded-2xl border p-4 shadow-sm ${
                expired
                  ? "border-gray-200 bg-gray-50 opacity-75"
                  : "border-amber-100 bg-white"
              }`}
            >
              <Link
                href={`/e/${event.slug}?token=${event.edit_token}`}
                className="block transition hover:opacity-80"
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
              <button
                type="button"
                onClick={() => cloneEvent(event.slug, event.edit_token)}
                disabled={cloningSlug === event.slug}
                className="mt-3 min-h-[40px] rounded-lg border border-amber-200 px-3 text-sm text-amber-700 hover:bg-amber-50 disabled:opacity-50"
              >
                {cloningSlug === event.slug ? "複製中..." : "複製"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
