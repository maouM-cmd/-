import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { AdSlot } from "@/components/AdSlot";
import { SubmissionCard } from "@/components/ChallengeCard";
import { NicknameSetup } from "@/components/NicknameSetup";
import { PromptForm } from "@/components/PromptForm";
import { getCategoryLabel } from "@/lib/categories";
import { getChallengeById, getSubmissionsByChallenge } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("submission");
  const tChallenge = await getTranslations("challenge");

  const challengeId = Number(id);
  const challenge = getChallengeById(challengeId);
  if (!challenge || challenge.status !== "active") notFound();

  const user = await getCurrentUser();
  const submissions = getSubmissionsByChallenge(challengeId, user?.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        {t("backChallenge")}
      </Link>

      <article className="mt-4 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
        {challenge.category && (
          <span className="mb-2 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
            {getCategoryLabel(challenge.category, locale)}
          </span>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{challenge.title}</h1>
        <p className="mt-3 leading-relaxed text-gray-700">{challenge.description}</p>
        {challenge.sample_output && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-800">{t("expectedOutput")}</p>
            <p className="mt-1">{challenge.sample_output}</p>
          </div>
        )}
      </article>

      <section className="mt-8">
        <NicknameSetup />
      </section>

      <AdSlot position="inline" className="my-6" />

      <section className="mt-6 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">{tChallenge("submitChallenge")}</h2>
        <PromptForm challengeId={challengeId} />
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold">
          {t("submissions")} ({submissions.length})
        </h2>
        {submissions.length === 0 ? (
          <p className="text-sm text-gray-500">{t("noSubmissions")}</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {submissions.map((s) => (
              <SubmissionCard key={s.id} submission={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
