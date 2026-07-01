import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { CommentSection } from "@/components/CommentSection";
import { LLMEvaluationDisplay } from "@/components/LLMEvaluationDisplay";
import { EvaluationDisplay } from "@/components/PromptForm";
import { ReportButton } from "@/components/ReportButton";
import { CopyLinkButton, RatingStars } from "@/components/RatingStars";
import { RANK_BG, SITE_NAME, computeTotalScore } from "@/lib/constants";
import { getSubmissionById } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { EvaluationResult } from "@/lib/types";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("submission");
  const submission = getSubmissionById(Number(id));
  if (!submission) return { title: t("notFound") };

  const evaluation = JSON.parse(submission.auto_feedback_json) as EvaluationResult;
  const total = computeTotalScore(submission.auto_score, submission.community_score);

  return {
    title: `${submission.challenge_title} — ${evaluation.rank} | ${SITE_NAME}`,
    description: t("metaDescription", {
      author: submission.author_name ?? "Anonymous",
      total,
    }),
    openGraph: {
      title: `${submission.challenge_title} — ${evaluation.rank}`,
      description: t("ogDescription", {
        auto: submission.auto_score,
        total,
      }),
    },
  };
}

export default async function SubmissionPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("submission");

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
              <p className="mt-1 text-sm font-medium">
                {t("totalScore", { total })}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <span>
              {t("autoScore")}: {t("points", { score: submission.auto_score })}
            </span>
            {submission.llm_score !== null && (
              <span>
                {t("llmScore")}: {t("points", { score: submission.llm_score })}
              </span>
            )}
            {submission.community_score !== null ? (
              <span>
                {t("communityCount", {
                  score: submission.community_score.toFixed(1),
                  count: submission.rating_count,
                })}
              </span>
            ) : (
              <span className="text-gray-400">{t("communityNone")}</span>
            )}
          </div>
        </header>

        <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h2 className="mb-3 font-bold text-gray-900">{t("prompt")}</h2>
          <pre className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">
            {submission.prompt_text}
          </pre>
        </section>

        <EvaluationDisplay evaluation={evaluation} />

        <section>
          <h2 className="mb-3 font-bold text-gray-900">{t("llmEvaluation")}</h2>
          <LLMEvaluationDisplay
            llmScore={submission.llm_score}
            llmFeedbackJson={submission.llm_feedback_json}
          />
        </section>

        <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
          <RatingStars
            submissionId={submission.id}
            currentRating={submission.user_rating ?? null}
            canRate={!isOwner && !!user}
          />
          {!user && (
            <p className="mt-2 text-sm text-amber-700">{t("rateLoginHint")}</p>
          )}
        </section>

        <CommentSection submissionId={submission.id} />

        <div className="flex items-center justify-between">
          <CopyLinkButton path={`/submissions/${submission.id}`} />
          {!isOwner && user && <ReportButton submissionId={submission.id} />}
        </div>
      </article>
    </div>
  );
}
