"use client";

import { useMemo, useState } from "react";
import { MatchCard } from "@/components/MatchCard";
import type { MatchBreakdown, Profile } from "@/lib/types";
import type { SincerityFilter } from "@/lib/sincerity";
import { SINCERITY_FILTER_OPTIONS, filterMatchesBySincerity } from "@/lib/sincerity";

export function DiscoverView({
  meName,
  matches,
}: {
  meName: string;
  matches: { profile: Profile; breakdown: MatchBreakdown }[];
}) {
  const [filter, setFilter] = useState<SincerityFilter>("all");

  const filtered = useMemo(
    () => filterMatchesBySincerity(matches, filter),
    [matches, filter]
  );

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">最適マッチ</h1>
      <p className="mt-2 text-sm text-gray-500">
        {meName} さんへの相性スコア順 — スタイルで絞り込みできます
      </p>

      <div className="mt-4">
        <p className="text-xs font-medium text-gray-500">スタイルで絞り込み</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SINCERITY_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                filter === opt.value
                  ? "bg-teal-500 text-white shadow-sm"
                  : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-teal-50"
              }`}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
        {filter !== "all" && (
          <p className="mt-2 text-xs text-teal-700">
            {filtered.length} 件表示（全 {matches.length} 件中）
          </p>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-gray-500">該当する人がいません</p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="mt-3 text-sm font-medium text-teal-600 hover:underline"
            >
              フィルターを解除
            </button>
          </div>
        ) : (
          filtered.map((m, i) => (
            <MatchCard
              key={m.profile.id}
              profile={m.profile}
              breakdown={m.breakdown}
              rank={i + 1}
            />
          ))
        )}
      </div>
    </div>
  );
}
