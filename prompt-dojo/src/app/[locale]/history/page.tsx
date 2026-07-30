import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PushNotifyButton } from "@/components/PushNotifyButton";
import { SubmissionCard } from "@/components/ChallengeCard";
import { NicknameSetup } from "@/components/NicknameSetup";
import { RANK_BG, scoreToRank } from "@/lib/constants";
import { getUserSubmissions } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("history");
  const tc = await getTranslations("common");

  const user = await getCurrentUser();
  const submissions = user ? getUserSubmissions(user.id) : [];

  const avgAuto =
    submissions.length > 0
      ? Math.round(
          submissions.reduce((s, x) => s + x.auto_score, 0) / submissions.length,
        )
      : 0;
  const bestTotal = submissions.reduce(
    (max, s) => Math.max(max, s.total_score ?? s.auto_score),
    0,
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        {tc("backHome")}
      </Link>
      <h1 className="mt-4 text-2xl font-bold">{t("title")}</h1>

      {!user && (
        <div className="mt-6">
          <NicknameSetup />
        </div>
      )}

      {user && (
        <>
          <div className="mt-6">
            <PushNotifyButton />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border bg-white p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600">{submissions.length}</p>
              <p className="text-sm text-gray-500">{t("submissionCount")}</p>
            </div>
            <div className="rounded-xl border bg-white p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600">{avgAuto}</p>
              <p className="text-sm text-gray-500">{t("avgAuto")}</p>
            </div>
            <div className="rounded-xl border bg-white p-4 text-center">
              <span
                className={`inline-block rounded-full px-3 py-1 text-2xl font-bold ${RANK_BG[scoreToRank(bestTotal)]}`}
              >
                {bestTotal}
              </span>
              <p className="mt-2 text-sm text-gray-500">{t("bestTotal")}</p>
            </div>
          </div>

          <section className="mt-8">
            {submissions.length === 0 ? (
              <p className="text-gray-500">
                {t("empty")}
                <Link href="/" className="text-indigo-600 hover:underline">
                  {t("tryChallenge")}
                </Link>
                {t("tryChallengeSuffix")}
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {submissions.map((s) => (
                  <SubmissionCard key={s.id} submission={s} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
