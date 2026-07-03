import Link from "next/link";
import { notFound } from "next/navigation";
import { BreakdownBars, ScoreRing } from "@/components/ScoreRing";
import { LOOKING_FOR_OPTIONS } from "@/lib/constants";
import { getMyProfile, getProfileById } from "@/lib/db";
import { computeMatch } from "@/lib/match";

function goalLabel(value: string) {
  return LOOKING_FOR_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = getMyProfile();
  const profile = getProfileById(Number(id));

  if (!profile) notFound();
  if (!me) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Link href="/profile" className="text-rose-600 underline">
          プロフィールを作成してください
        </Link>
      </div>
    );
  }

  const breakdown = computeMatch(me, profile);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href="/discover" className="text-sm text-rose-500 hover:underline">
        ← 一覧に戻る
      </Link>
      <div className="mt-4 rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <ScoreRing score={breakdown.totalScore} />
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-sm text-gray-400">{profile.age}歳 · {goalLabel(profile.looking_for)}</p>
          </div>
        </div>
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
        <h2 className="font-bold text-gray-900">相性内訳</h2>
        <div className="mt-4">
          <BreakdownBars breakdown={breakdown} />
        </div>
        <ul className="mt-4 space-y-1 text-sm text-gray-600">
          {breakdown.reasons.map((r) => (
            <li key={r}>✓ {r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
