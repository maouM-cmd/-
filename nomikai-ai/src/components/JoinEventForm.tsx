"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  JoinSuccessBanner,
  saveParticipantSession,
} from "@/components/ParticipantEditForm";
import { formatDateLabel, timeSlots } from "@/lib/constants";
import { withLang, type Locale } from "@/lib/i18n";
import type { AvailabilitySlot, DateOption } from "@/lib/types";

function joinMessages(locale: Locale) {
  return locale === "en"
    ? {
        name: "Your name",
        station: "Nearest station",
        stationHelp: 'You can omit "Station". Used to calculate the meeting point.',
        availability: "Available dates & times",
        selectSlot: "Select at least one available time slot",
        joinFailed: "Failed to register",
        networkError: "Network error occurred",
        submitting: "Submitting...",
        submit: "Join event",
        toEvent: "Go to event page",
      }
    : {
        name: "お名前",
        station: "最寄駅",
        stationHelp: "「駅」は省略可。中間地点の計算に使います。",
        availability: "参加可能な日時",
        selectSlot: "参加可能な日時を1つ以上選んでください",
        joinFailed: "登録に失敗しました",
        networkError: "通信エラーが発生しました",
        submitting: "送信中...",
        submit: "参加登録する",
        toEvent: "イベントページへ",
      };
}

export function JoinEventForm({
  slug,
  dateOptions,
  locale,
}: {
  slug: string;
  dateOptions: DateOption[];
  locale: Locale;
}) {
  const router = useRouter();
  const t = joinMessages(locale);
  const slots = timeSlots(locale);
  const [name, setName] = useState("");
  const [station, setStation] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    participantId: number;
    participantToken: string;
    editUrl: string;
  } | null>(null);

  function slotKey(date: string, timeSlot: string) {
    return `${date}|${timeSlot}`;
  }

  function toggleSlot(date: string, timeSlot: string) {
    const key = slotKey(date, timeSlot);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function timeLabel(timeSlot: string) {
    return slots.find((s) => s.value === timeSlot)?.label ?? timeSlot;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected.size === 0) {
      setError(t.selectSlot);
      return;
    }

    setLoading(true);
    setError("");

    const availability: AvailabilitySlot[] = Array.from(selected).map((key) => {
      const [date, timeSlot] = key.split("|");
      return { date, timeSlot };
    });

    try {
      const res = await fetch(`/api/events/${slug}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, station, availability }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t.joinFailed);
        return;
      }
      saveParticipantSession(slug, data.participant.id, data.participant_token);
      setSuccess({
        participantId: data.participant.id,
        participantToken: data.participant_token,
        editUrl: data.edit_url,
      });
    } catch {
      setError(t.networkError);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="space-y-4">
        <JoinSuccessBanner
          slug={slug}
          editUrl={success.editUrl}
          participantToken={success.participantToken}
          participantId={success.participantId}
          locale={locale}
        />
        <button
          type="button"
          onClick={() => router.push(withLang(`/e/${slug}`, locale))}
          className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-amber-500 text-lg font-bold text-white"
        >
          {t.toEvent}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">{t.name}</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={locale === "en" ? "e.g. Alex" : "例: 山田"}
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">{t.station}</label>
        <input
          type="text"
          required
          value={station}
          onChange={(e) => setStation(e.target.value)}
          placeholder={locale === "en" ? "e.g. Shibuya" : "例: 渋谷"}
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
        />
        <p className="mt-1 text-xs text-gray-500">{t.stationHelp}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">{t.availability}</label>
        <div className="mt-2 space-y-2">
          {dateOptions.map((opt) => {
            const key = slotKey(opt.date, opt.timeSlot);
            const checked = selected.has(key);
            const dateLabel = formatDateLabel(opt.date, locale);

            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleSlot(opt.date, opt.timeSlot)}
                className={`flex min-h-[48px] w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                  checked
                    ? "border-amber-400 bg-amber-50 text-amber-800"
                    : "border-gray-200 bg-white text-gray-600"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    checked ? "border-amber-500 bg-amber-500 text-white" : "border-gray-300"
                  }`}
                >
                  {checked && "✓"}
                </span>
                {dateLabel} {timeLabel(opt.timeSlot)}
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-amber-500 text-lg font-bold text-white hover:bg-amber-600 disabled:opacity-50"
      >
        {loading ? t.submitting : t.submit}
      </button>
    </form>
  );
}
