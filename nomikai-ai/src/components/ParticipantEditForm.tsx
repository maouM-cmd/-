"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TIME_SLOTS } from "@/lib/constants";
import type { AvailabilitySlot, DateOption, Participant } from "@/lib/types";

function storageKey(slug: string) {
  return `nomikai_participant_${slug}`;
}

export function saveParticipantSession(
  slug: string,
  participantId: number,
  participantToken: string
) {
  localStorage.setItem(
    storageKey(slug),
    JSON.stringify({ participantId, participantToken })
  );
}

export function loadParticipantSession(slug: string): {
  participantId: number;
  participantToken: string;
} | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(storageKey(slug));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { participantId: number; participantToken: string };
  } catch {
    return null;
  }
}

export function ParticipantEditForm({
  slug,
  dateOptions,
  participant,
  participantToken,
}: {
  slug: string;
  dateOptions: DateOption[];
  participant: Participant;
  participantToken: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(participant.name);
  const [station, setStation] = useState(participant.station);
  const [selected, setSelected] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const slot of participant.availability) {
      initial.add(`${slot.date}|${slot.timeSlot}`);
    }
    return initial;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const res = await fetch(`/api/events/${slug}/participants/${participant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, station, availability, participant_token: participantToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "更新に失敗しました");
        return;
      }
      saveParticipantSession(slug, participant.id, participantToken);
      router.push(`/e/${slug}`);
      router.refresh();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
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
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-base"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">最寄駅</label>
        <input
          type="text"
          required
          value={station}
          onChange={(e) => setStation(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-base"
        />
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
                className={`flex min-h-[48px] w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm ${
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
        className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-amber-500 text-lg font-bold text-white disabled:opacity-50"
      >
        {loading ? "更新中..." : "回答を更新する"}
      </button>
    </form>
  );
}

export function JoinSuccessBanner({
  slug,
  editUrl,
  participantToken,
  participantId,
}: {
  slug: string;
  editUrl: string;
  participantToken: string;
  participantId: number;
}) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${editUrl}` : editUrl;

  useEffect(() => {
    saveParticipantSession(slug, participantId, participantToken);
  }, [slug, participantId, participantToken]);

  async function copyEditUrl() {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
      <p className="text-sm font-medium text-green-800">参加登録が完了しました</p>
      <p className="mt-1 text-xs text-green-700">あとから回答を変更する場合は、このリンクを保存してください。</p>
      <button
        type="button"
        onClick={copyEditUrl}
        className="mt-3 min-h-[44px] rounded-lg bg-green-600 px-4 text-sm font-medium text-white"
      >
        {copied ? "コピー済" : "編集用リンクをコピー"}
      </button>
    </div>
  );
}
