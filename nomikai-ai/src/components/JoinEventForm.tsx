"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TIME_SLOTS } from "@/lib/constants";
import {
  JoinSuccessBanner,
  saveParticipantSession,
} from "@/components/ParticipantEditForm";
import type { AvailabilitySlot, DateOption } from "@/lib/types";

export function JoinEventForm({
  slug,
  dateOptions,
}: {
  slug: string;
  dateOptions: DateOption[];
}) {
  const router = useRouter();
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
    return TIME_SLOTS.find((t) => t.value === timeSlot)?.label ?? timeSlot;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected.size === 0) {
      setError("参加可能な日時を1つ以上選んでください");
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
        setError(data.error ?? "登録に失敗しました");
        return;
      }
      saveParticipantSession(slug, data.participant.id, data.participant_token);
      setSuccess({
        participantId: data.participant.id,
        participantToken: data.participant_token,
        editUrl: data.edit_url,
      });
    } catch {
      setError("通信エラーが発生しました");
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
        />
        <button
          type="button"
          onClick={() => router.push(`/e/${slug}`)}
          className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-amber-500 text-lg font-bold text-white"
        >
          イベントページへ
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">お名前</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: 山田"
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">最寄駅</label>
        <input
          type="text"
          required
          value={station}
          onChange={(e) => setStation(e.target.value)}
          placeholder="例: 渋谷"
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
        />
        <p className="mt-1 text-xs text-gray-500">「駅」は省略可。中間地点の計算に使います。</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">参加可能な日時</label>
        <div className="mt-2 space-y-2">
          {dateOptions.map((opt) => {
            const key = slotKey(opt.date, opt.timeSlot);
            const checked = selected.has(key);
            const d = new Date(opt.date + "T12:00:00");
            const days = ["日", "月", "火", "水", "木", "金", "土"];
            const dateLabel = `${d.getMonth() + 1}/${d.getDate()}(${days[d.getDay()]})`;

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
        {loading ? "送信中..." : "参加登録する"}
      </button>
    </form>
  );
}
