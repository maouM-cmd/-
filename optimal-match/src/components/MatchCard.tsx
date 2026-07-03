import Link from "next/link";
import type { MatchBreakdown, Profile } from "@/lib/types";
import { LOOKING_FOR_OPTIONS } from "@/lib/constants";
import { MatchTierBadge } from "./MatchTierBadge";
import { SincerityBadge } from "./SincerityBadge";
import { ScoreRing } from "./ScoreRing";

function goalLabel(value: string) {
  return LOOKING_FOR_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function MatchCard({
  profile,
  breakdown,
  rank,
}: {
  profile: Profile;
  breakdown: MatchBreakdown;
  rank?: number;
}) {
  return (
    <Link
      href={`/match/${profile.id}`}
      className="block rounded-2xl border border-rose-100 bg-white p-4 shadow-sm transition hover:border-rose-300 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        {rank != null && (
          <span className="mt-1 text-xs font-bold text-rose-400">#{rank}</span>
        )}
        <ScoreRing score={breakdown.totalScore} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">{profile.name}</h3>
            <MatchTierBadge breakdown={breakdown} />
          </div>
          <p className="mt-0.5 text-sm text-gray-400">
            {profile.age}歳 · {goalLabel(profile.looking_for)}
          </p>
          <div className="mt-1">
            <SincerityBadge score={profile.sincerity} />
          </div>
          {breakdown.advantageSummary && (
            <p className="mt-1 line-clamp-1 text-xs text-emerald-600">
              {breakdown.advantageSummary}
            </p>
          )}
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">{profile.bio}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {profile.interests.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full bg-rose-50 px-2 py-0.5 text-xs text-rose-700">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
