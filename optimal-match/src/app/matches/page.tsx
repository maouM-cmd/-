import Link from "next/link";
import { MatchCard } from "@/components/MatchCard";
import { getLikedProfileIds, getMutualMatches, getProfileById, getProfileByUserId } from "@/lib/db";
import { computeMatch } from "@/lib/match";
import { requireUser } from "@/lib/session";

export default async function MatchesPage() {
  const user = await requireUser();
  const myProfile = getProfileByUserId(user.id);

  if (!myProfile) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-gray-500">先にプロフィールを作成してください</p>
        <Link href="/profile" className="mt-4 inline-block text-rose-600 underline">
          プロフィールへ
        </Link>
      </div>
    );
  }

  const mutualRaw = getMutualMatches(user.id);
  const mutual = mutualRaw.map((m) => ({
    profile: m.profile,
    breakdown: computeMatch(myProfile, m.profile),
  }));

  const likedIds = getLikedProfileIds(user.id);
  const likedOnly = likedIds
    .filter((id) => !mutual.some((m) => m.profile.id === id))
    .map((id) => getProfileById(id))
    .filter(Boolean)
    .map((profile) => ({
      profile: profile!,
      breakdown: computeMatch(myProfile, profile!),
    }));

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">マッチ・いいね</h1>
      <p className="mt-2 text-sm text-gray-500">
        相互いいねでマッチ成立。シードユーザーは一方的ないいねのみ。
      </p>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-700">
          🎉 マッチ成立
          <span className="text-sm font-normal text-gray-400">({mutual.length})</span>
        </h2>
        {mutual.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">
            まだマッチはありません。気になる人にいいねして、お互いにいいねされると成立します。
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {mutual.map((m) => (
              <MatchCard
                key={m.profile.id}
                profile={m.profile}
                breakdown={m.breakdown}
                chatUserId={m.profile.user_id}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-lg font-bold text-rose-600">
          ♥ いいねした人
          <span className="text-sm font-normal text-gray-400">({likedOnly.length})</span>
        </h2>
        {likedOnly.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">
            まだいいねしていません。{" "}
            <Link href="/discover" className="text-rose-600 underline">
              最適マッチ
            </Link>
            から探しましょう。
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {likedOnly.map((m) => (
              <MatchCard key={m.profile.id} profile={m.profile} breakdown={m.breakdown} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
