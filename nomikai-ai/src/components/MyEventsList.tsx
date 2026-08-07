"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { withLang, type Locale } from "@/lib/i18n";
import type { UserEventSummary } from "@/lib/types";

export function MyEventsList({ events, locale }: { events: UserEventSummary[]; locale: Locale }) {
  const router = useRouter();
  const [cloningSlug, setCloningSlug] = useState<string | null>(null);
  const [error, setError] = useState("");
  const t = locale === "en"
    ? {
        cloneFailed: "Failed to clone event",
        networkError: "Network error occurred",
        noEvents: "No events yet.",
        createEvent: "Create event",
        participants: "Participants",
        planned: "Planned",
        ended: "Ended",
        cloning: "Cloning...",
        clone: "Clone",
      }
    : {
        cloneFailed: "複製に失敗しました",
        networkError: "通信エラーが発生しました",
        noEvents: "まだ飲み会がありません。",
        createEvent: "飲み会を作る",
        participants: "参加者",
        planned: "プラン済",
        ended: "終了",
        cloning: "複製中...",
        clone: "複製",
      };

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
        setError(data.error ?? t.cloneFailed);
        return;
      }
      router.push(withLang(`/e/${data.slug}?token=${data.edit_token}`, locale));
      router.refresh();
    } catch {
      setError(t.networkError);
    } finally {
      setCloningSlug(null);
    }
  }

  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-white p-6 text-center">
        <p className="text-gray-600">{t.noEvents}</p>
        <Link
          href={withLang("/create", locale)}
          className="mt-4 inline-flex min-h-[44px] items-center rounded-xl bg-amber-500 px-6 text-white hover:bg-amber-600"
        >
          {t.createEvent}
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
                href={withLang(`/e/${event.slug}?token=${event.edit_token}`, locale)}
                className="block transition hover:opacity-80"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-bold text-gray-900">{event.title}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {t.participants} {participant_count}
                      {has_plan && ` · ${t.planned}`}
                      {expired && ` · ${t.ended}`}
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
                {cloningSlug === event.slug ? t.cloning : t.clone}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
