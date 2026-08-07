"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ParticipantPushPrompt } from "@/components/ParticipantPushPrompt";
import { formatDateLabel, timeSlots } from "@/lib/constants";
import { withLang, type Locale } from "@/lib/i18n";
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

function editMessages(locale: Locale) {
  return locale === "en"
    ? {
        name: "Your name",
        station: "Nearest station",
        availability: "Available dates & times",
        selectSlot: "Select at least one available time slot",
        updateFailed: "Failed to update",
        networkError: "Network error occurred",
        updating: "Updating...",
        submit: "Update response",
      }
    : {
        name: "お名前",
        station: "最寄駅",
        availability: "参加可能な日時",
        selectSlot: "参加可能な日時を1つ以上選んでください",
        updateFailed: "更新に失敗しました",
        networkError: "通信エラーが発生しました",
        updating: "更新中...",
        submit: "回答を更新する",
      };
}

function successMessages(locale: Locale) {
  return locale === "en"
    ? {
        title: "Registration complete",
        hint: "Save this link if you want to change your response later.",
        copied: "Copied",
        copyEditLink: "Copy edit link",
      }
    : {
        title: "参加登録が完了しました",
        hint: "あとから回答を変更する場合は、このリンクを保存してください。",
        copied: "コピー済",
        copyEditLink: "編集用リンクをコピー",
      };
}

export function ParticipantEditForm({
  slug,
  dateOptions,
  participant,
  participantToken,
  locale,
}: {
  slug: string;
  dateOptions: DateOption[];
  participant: Participant;
  participantToken: string;
  locale: Locale;
}) {
  const router = useRouter();
  const t = editMessages(locale);
  const slots = timeSlots(locale);
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
      const res = await fetch(`/api/events/${slug}/participants/${participant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, station, availability, participant_token: participantToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t.updateFailed);
        return;
      }
      saveParticipantSession(slug, participant.id, participantToken);
      router.push(withLang(`/e/${slug}`, locale));
      router.refresh();
    } catch {
      setError(t.networkError);
    } finally {
      setLoading(false);
    }
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
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-base"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t.station}</label>
        <input
          type="text"
          required
          value={station}
          onChange={(e) => setStation(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-base"
        />
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
        {loading ? t.updating : t.submit}
      </button>
    </form>
  );
}

export function JoinSuccessBanner({
  slug,
  editUrl,
  participantToken,
  participantId,
  locale,
}: {
  slug: string;
  editUrl: string;
  participantToken: string;
  participantId: number;
  locale: Locale;
}) {
  const t = successMessages(locale);
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
    <div className="space-y-4">
      <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
        <p className="text-sm font-medium text-green-800">{t.title}</p>
        <p className="mt-1 text-xs text-green-700">{t.hint}</p>
        <button
          type="button"
          onClick={copyEditUrl}
          className="mt-3 min-h-[44px] rounded-lg bg-green-600 px-4 text-sm font-medium text-white"
        >
          {copied ? t.copied : t.copyEditLink}
        </button>
      </div>
      <ParticipantPushPrompt
        slug={slug}
        participantId={participantId}
        participantToken={participantToken}
        locale={locale}
      />
    </div>
  );
}
