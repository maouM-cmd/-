import Link from "next/link";
import type { MatchBreakdown, Profile } from "@/lib/types";
import { LOOKING_FOR_OPTIONS } from "@/lib/constants";
import { Avatar } from "./Avatar";
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
  chatUserId,
}: {
  profile: Profile;
  breakdown: MatchBreakdown;
  rank?: number;
  chatUserId?: number | null;
}) {
  const cardBody = (
    <div className="flex items-start gap-3">
        {rank != null && (
          <span className="mt-3 text-xs font-bold text-rose-400">#{rank}</span>
        )}
        <Avatar name={profile.name} photoPath={profile.photo_path} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">{profile.name}</h3>
              <MatchTierBadge breakdown={breakdown} />
            </div>
            <ScoreRing score={breakdown.totalScore} />
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
  );

  if (chatUserId) {
    return (
      <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
        <Link
          href={`/match/${profile.id}`}
          className="block transition hover:opacity-90"
        >
          {cardBody}
        </Link>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href={`/chat/${chatUserId}`}
            className="inline-block rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700"
          >
            チャットする
          </Link>
          <Link
            href={`/match/${profile.id}`}
            className="inline-block text-sm font-medium text-rose-600 hover:underline"
          >
            プロフィール →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/match/${profile.id}`}
      className="block rounded-2xl border border-rose-100 bg-white p-4 shadow-sm transition hover:border-rose-300 hover:shadow-md"
    >
      {cardBody}
    </Link>
  );
}
