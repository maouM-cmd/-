import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EvaluationDisplay } from "@/components/PromptForm";
import { CopyLinkButton, RatingStars } from "@/components/RatingStars";
import { RANK_BG, SITE_NAME, computeTotalScore } from "@/lib/constants";
import { getSubmissionById } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { EvaluationResult } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const submission = getSubmissionById(Number(id));
  if (!submission) return { title: "投稿が見つかりません" };

  const evaluation = JSON.parse(submission.auto_feedback_json) as EvaluationResult;
  const total = computeTotalScore(submission.auto_score, submission.community_score);

  return {
    title: `${submission.challenge_title} — ${evaluation.rank}ランク | ${SITE_NAME}`,
    description: `${submission.author_name}さんのプロンプト（総合${total}点）`,
    openGraph: {
      title: `${submission.challenge_title} — ${evaluation.rank}ランク`,
      description: `自動${submission.auto_score}点 / 総合${total}点`,
    },
  };
}

export default async function SubmissionPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  const submission = getSubmissionById(Number(id), user?.id);
  if (!submission) notFound();

  const evaluation = JSON.parse(
    submission.auto_feedback_json,
  ) as EvaluationResult;
  const total = computeTotalScore(submission.auto_score, submission.community_score);
  const isOwner = user?.id === submission.user_id;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href={`/challenges/${submission.challenge_id}`}
        className="text-sm text-indigo-600 hover:underline"
      >
        ← {submission.challenge_title}
      </Link>

      <article className="mt-4 space-y-6">
        <header className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">{submission.author_name}</p>
              <h1 className="mt-1 text-xl font-bold">{submission.challenge_title}</h1>
              <p className="mt-1 text-xs text-gray-400">{submission.created_at}</p>
            </div>
            <div className="text-right">
              <span
                className={`rounded-full px-3 py-1 text-lg font-bold ${RANK_BG[evaluation.rank]}`}
              >
                {evaluation.rank}
              </span>
              <p className="mt-1 text-sm font-medium">総合 {total}点</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <span>自動スコア: {submission.auto_score}点</span>
            {submission.community_score !== null ? (
              <span>
                みんなの評価: ★{submission.community_score.toFixed(1)} (
                {submission.rating_count}件)
              </span>
            ) : (
              <span className="text-gray-400">みんなの評価: まだありません</span>
            )}
          </div>
        </header>

        <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h2 className="mb-3 font-bold text-gray-900">プロンプト</h2>
          <pre className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">
            {submission.prompt_text}
          </pre>
        </section>

        <EvaluationDisplay evaluation={evaluation} />

        <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
          <RatingStars
            submissionId={submission.id}
            currentRating={submission.user_rating ?? null}
            canRate={!isOwner && !!user}
          />
          {!user && (
            <p className="mt-2 text-sm text-amber-700">
              評価するにはトップページでニックネームを設定してください
            </p>
          )}
        </section>

        <div className="flex justify-center">
          <CopyLinkButton path={`/submissions/${submission.id}`} />
        </div>
      </article>
    </div>
  );
}
