import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { AdSlot } from "@/components/AdSlot";
import { ChallengeFilter } from "@/components/ChallengeFilter";
import { SubmissionCard } from "@/components/ChallengeCard";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { NicknameSetup } from "@/components/NicknameSetup";
import { getCategoryLabel } from "@/lib/categories";
import { getAllCategories, getAllChallenges, getLeaderboard, seedIfEmpty } from "@/lib/db";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const tf = await getTranslations("footer");

  seedIfEmpty();
  const challenges = getAllChallenges();
  const categories = getAllCategories();
  const topEntries = getLeaderboard("total", 10);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <section className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 text-white shadow-lg shadow-indigo-200">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{t("heroTitle")}</h1>
        <p className="text-indigo-100">{t("heroSubtitle")}</p>
        <p className="mt-1 text-xs text-indigo-200">
          {t("termsAgree")}
          <Link href="/terms" className="underline hover:text-white">
            {tf("terms")}
          </Link>
          {t("termsAgreeSuffix")}
        </p>
      </section>

      <NicknameSetup />

      <AdSlot position="inline" className="my-8" />

      <ChallengeFilter
        initialChallenges={challenges}
        initialCategories={categories}
        categoryLabel={(c) => getCategoryLabel(c, locale)}
        allLabel={t("challenges")}
        countLabel={(n) => t("challengeCount", { count: n })}
        emptyLabel={t("noChallenges")}
        offlineHint={tc("offlineHint")}
      />

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{t("rankingTop")}</h2>
          <Link
            href="/leaderboard"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            {t("viewAll")}
          </Link>
        </div>
        <LeaderboardTable entries={topEntries} type="total" />
      </section>

      {topEntries.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900">{t("recentPosts")}</h2>
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
