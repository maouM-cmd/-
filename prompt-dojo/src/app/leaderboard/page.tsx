import Link from "next/link";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { getLeaderboard } from "@/lib/db";
import type { LeaderboardType } from "@/lib/types";

const TABS: { key: LeaderboardType; label: string }[] = [
  { key: "total", label: "総合" },
  { key: "auto", label: "自動スコア" },
  { key: "community", label: "みんなの評価" },
];

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const type = (params.type as LeaderboardType) ?? "total";
  const validType = TABS.some((t) => t.key === type) ? type : "total";
  const entries = getLeaderboard(validType, 50);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        ← トップ
      </Link>
      <h1 className="mt-4 text-2xl font-bold">ランキング</h1>
      <p className="mt-1 text-sm text-gray-500">
        総合スコア = 自動スコア×40% + みんなの評価×60%
      </p>

      <nav className="mt-6 flex gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/leaderboard?type=${tab.key}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              validType === tab.key
                ? "bg-indigo-600 text-white"
                : "border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6">
        <LeaderboardTable entries={entries} />
      </div>
    </div>
  );
}
