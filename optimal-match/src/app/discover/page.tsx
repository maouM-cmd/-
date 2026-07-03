import Link from "next/link";
import { MatchCard } from "@/components/MatchCard";
import { getMyProfile, getAllProfiles } from "@/lib/db";
import { withMatches } from "@/lib/match";

export default function DiscoverPage() {
  const me = getMyProfile();

  if (!me) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900">プロフィールが必要です</h1>
        <p className="mt-2 text-sm text-gray-500">
          まずあなたの情報を登録してから、最適マッチを表示できます。
        </p>
        <Link
          href="/profile"
          className="mt-6 inline-block rounded-xl bg-rose-500 px-6 py-3 font-bold text-white"
        >
          プロフィールを作成
        </Link>
      </div>
    );
  }

  const matches = withMatches(me, getAllProfiles());

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">最適マッチ</h1>
      <p className="mt-2 text-sm text-gray-500">
        {me.name} さんへの相性スコア順（全 {matches.length} 人）
      </p>
      <div className="mt-6 space-y-4">
        {matches.map((m, i) => (
          <MatchCard
            key={m.profile.id}
            profile={m.profile}
            breakdown={m.breakdown}
            rank={i + 1}
          />
        ))}
      </div>
    </div>
  );
}
