import Link from "next/link";
import { notFound } from "next/navigation";
import { ConversationStarters } from "@/components/ConversationStarters";
import { LikeButton } from "@/components/LikeButton";
import { MatchTierBadge } from "@/components/MatchTierBadge";
import { Avatar } from "@/components/Avatar";
import { SincerityBadge, SincerityMismatchWarning } from "@/components/SincerityBadge";
import { BreakdownBars, ScoreRing } from "@/components/ScoreRing";
import { LOOKING_FOR_OPTIONS } from "@/lib/constants";
import { getProfileById, hasLiked } from "@/lib/db";
import { computeMatch } from "@/lib/match";
import { requireProfile, getCurrentUser } from "@/lib/session";

function goalLabel(value: string) {
  return LOOKING_FOR_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { profile: me } = await requireProfile();
  const user = await getCurrentUser();
  const { id } = await params;
  const profile = getProfileById(Number(id));

  if (!profile || profile.id === me.id) notFound();

  const breakdown = computeMatch(me, profile);
  const liked = user ? hasLiked(user.id, profile.id) : false;

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href="/discover" className="text-sm text-rose-500 hover:underline">
        ← 一覧に戻る
      </Link>
      <div className="mt-4 rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <Avatar name={profile.name} photoPath={profile.photo_path} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <MatchTierBadge breakdown={breakdown} />
            </div>
            <p className="text-sm text-gray-400">
              {profile.age}歳 · {goalLabel(profile.looking_for)}
            </p>
            <div className="mt-2">
              <SincerityBadge score={profile.sincerity} size="md" />
            </div>
            <div className="mt-3">
              <ScoreRing score={breakdown.totalScore} />
            </div>
          </div>
        </div>
        {breakdown.advantageSummary && (
          <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {breakdown.advantageSummary}
          </p>
        )}
        {breakdown.sincerityGap != null && breakdown.mySincerityLabel && breakdown.otherSincerityLabel && (
          <div className="mt-4">
            <SincerityMismatchWarning
              gap={breakdown.sincerityGap}
              myLabel={breakdown.mySincerityLabel}
              otherLabel={breakdown.otherSincerityLabel}
            />
          </div>
        )}
        <p className="mt-4 text-gray-600">{profile.bio}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.interests.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-3 py-1 text-sm ${
                me.interests.includes(tag)
                  ? "bg-rose-500 text-white"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-6">
        <h2 className="font-bold text-gray-900">説明可能マッチング（相性内訳）</h2>
        <div className="mt-4">
          <BreakdownBars breakdown={breakdown} />
        </div>
        <ul className="mt-4 space-y-1 text-sm text-gray-600">
          {breakdown.reasons.map((r) => (
            <li key={r}>✓ {r}</li>
          ))}
        </ul>
      </div>

      {breakdown.conversationStarters && (
        <div className="mt-6 rounded-2xl border border-violet-100 bg-white p-6">
          <ConversationStarters starters={breakdown.conversationStarters} />
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-6">
        <LikeButton profileId={profile.id} initialLiked={liked} />
      </div>
    </div>
  );
}
