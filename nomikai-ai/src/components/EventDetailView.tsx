"use client";

import { useState } from "react";
import Link from "next/link";
import { CopyList } from "@/components/CopyCard";
import { VenueCard } from "@/components/VenueCard";
import { BUDGET_OPTIONS, MOOD_OPTIONS } from "@/lib/constants";
import type { EventDetail } from "@/lib/types";

export function EventDetailView({
  detail,
  editToken,
}: {
  detail: EventDetail;
  editToken?: string;
}) {
  const { event, participants, plan } = detail;
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [localPlan, setLocalPlan] = useState(plan);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/e/${event.slug}`
      : `/e/${event.slug}`;

  const moodLabel = MOOD_OPTIONS.find((m) => m.value === event.mood);
  const budgetLabel = BUDGET_OPTIONS.find((b) => b.value === event.budget)?.label;

  async function copyShareUrl() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function generatePlan() {
    if (!editToken) return;
    setGenerating(true);
    setError("");

    try {
      const res = await fetch(`/api/events/${event.slug}/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edit_token: editToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "プラン生成に失敗しました");
        return;
      }
      setLocalPlan(data.plan);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>
        <p className="mt-1 text-sm text-gray-500">幹事: {event.organizer_name}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
            {moodLabel?.emoji} {moodLabel?.label}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
            {budgetLabel}
          </span>
        </div>
      </div>

      {editToken && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
          <p className="text-sm font-medium text-amber-800">幹事用リンク（このURLは秘密に）</p>
          <div className="mt-2 flex gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs text-gray-600"
            />
            <button
              type="button"
              onClick={copyShareUrl}
              className="min-h-[44px] shrink-0 rounded-lg bg-amber-500 px-4 text-sm font-medium text-white"
            >
              {copied ? "コピー済" : "共有"}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">参加者 ({participants.length}人)</h2>
          <Link
            href={`/e/${event.slug}/join`}
            className="text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            + 参加登録
          </Link>
        </div>
        {participants.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">まだ参加者がいません。リンクを共有しましょう。</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {participants.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
              >
                <span className="font-medium">{p.name}</span>
                <span className="text-gray-500">{p.station}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editToken && (
        <button
          type="button"
          onClick={generatePlan}
          disabled={generating || participants.length === 0}
          className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-amber-500 text-lg font-bold text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {generating ? "プラン生成中..." : "プランを生成する"}
        </button>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {localPlan && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-green-100 bg-green-50/50 p-5">
            <h2 className="font-bold text-green-800">おすすめ日時</h2>
            <p className="mt-2 text-lg font-medium text-gray-900">
              {localPlan.boost_content.recommendedSlot?.label ?? "候補日時を確認してください"}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
            <h2 className="font-bold text-blue-800">集合場所（中間地点）</h2>
            <p className="mt-2 text-2xl font-bold text-gray-900">{localPlan.middle_station}</p>
            <p className="mt-1 text-sm text-gray-500">全員の最寄駅から算出した中間地点です</p>
          </div>

          <div className="space-y-3">
            <h2 className="font-bold text-gray-900">お店候補</h2>
            {localPlan.venues.map((venue, i) => (
              <VenueCard key={i} venue={venue} index={i} />
            ))}
          </div>

          <CopyList title="乾杯の挨拶" items={localPlan.boost_content.toasts} emoji="🥂" />
          <CopyList title="盛り上げゲーム" items={localPlan.boost_content.games} emoji="🎮" />
          <CopyList
            title="会話のきっかけ"
            items={localPlan.boost_content.conversationStarters}
            emoji="💬"
          />
          <CopyList
            title="2次会の提案"
            items={[localPlan.boost_content.afterParty]}
            emoji="🌙"
          />
        </div>
      )}
    </div>
  );
}
