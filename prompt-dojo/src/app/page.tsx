import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { ChallengeCard, SubmissionCard } from "@/components/ChallengeCard";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { NicknameSetup } from "@/components/NicknameSetup";
import { getAllChallenges, getLeaderboard, seedIfEmpty } from "@/lib/db";

export default function Home() {
  seedIfEmpty();
  const challenges = getAllChallenges();
  const topEntries = getLeaderboard("total", 10);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <section className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 text-white shadow-lg shadow-indigo-200">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
          プロンプトを書いて、評価されよう
        </h1>
        <p className="text-indigo-100">
          課題に挑戦 → 自動チェックで即時フィードバック → みんなの星評価でランキング
        </p>
        <p className="mt-1 text-xs text-indigo-200">
          利用により
          <Link href="/terms" className="underline hover:text-white">
            利用規約
          </Link>
          に同意したものとみなします
        </p>
      </section>

      <NicknameSetup />

      <AdSlot position="inline" className="my-8" />

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">課題一覧</h2>
          <span className="text-sm text-gray-500">{challenges.length} 件</span>
        </div>
        {challenges.length === 0 ? (
          <p className="rounded-xl border border-dashed py-12 text-center text-gray-500">
            課題がまだありません
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((c) => (
              <ChallengeCard key={c.id} challenge={c} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">ランキング TOP10</h2>
          <Link
            href="/leaderboard"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            すべて見る →
          </Link>
        </div>
        <LeaderboardTable entries={topEntries} type="total" />
      </section>

      {topEntries.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900">最近の投稿</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {topEntries.slice(0, 4).map((e) => (
              <SubmissionCard
                key={e.submission_id}
                submission={{
                  id: e.submission_id,
                  author_name: e.author_name,
                  auto_score: e.auto_score,
                  community_score: e.community_score,
                  rating_count: e.rating_count,
                  total_score: e.total_score,
                  created_at: e.created_at,
                  prompt_text: e.challenge_title,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
