import Link from "next/link";
import { RANK_BG } from "@/lib/constants";
import { scoreToRank } from "@/lib/constants";
import type { Challenge } from "@/lib/types";

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  return (
    <Link
      href={`/challenges/${challenge.id}`}
      className="block rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
    >
      <h2 className="text-lg font-bold text-gray-900">{challenge.title}</h2>
      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
        {challenge.description}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>{challenge.submission_count ?? 0} 件の投稿</span>
        <span className="font-medium text-indigo-600">挑戦する →</span>
      </div>
    </Link>
  );
}

export function SubmissionCard({
  submission,
}: {
  submission: {
    id: number;
    author_name?: string;
    auto_score: number;
    community_score: number | null;
    rating_count: number;
    total_score?: number;
    created_at: string;
    prompt_text: string;
  };
}) {
  const rank = scoreToRank(submission.total_score ?? submission.auto_score);
  return (
    <Link
      href={`/submissions/${submission.id}`}
      className="block rounded-xl border border-gray-100 bg-white p-4 transition hover:border-indigo-200"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">
            {submission.author_name ?? "匿名"}
          </p>
          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
            {submission.prompt_text}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${RANK_BG[rank]}`}
        >
          {rank}
        </span>
      </div>
      <div className="mt-3 flex gap-3 text-xs text-gray-500">
        <span>自動 {submission.auto_score}点</span>
        {submission.community_score !== null && (
          <span>
            みんなの評価 ★{submission.community_score.toFixed(1)} (
            {submission.rating_count}件)
          </span>
        )}
      </div>
    </Link>
  );
}
