import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { AdSlot } from "@/components/AdSlot";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { getLeaderboard } from "@/lib/db";
import type { LeaderboardType } from "@/lib/types";

const TAB_KEYS: LeaderboardType[] = ["total", "auto", "llm", "community"];

export default async function LeaderboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("leaderboard");
  const tc = await getTranslations("common");

  const query = await searchParams;
  const type = (query.type as LeaderboardType) ?? "total";
  const validType = TAB_KEYS.includes(type) ? type : "total";
  const entries = getLeaderboard(validType, 50, locale);

  const tabLabels: Record<LeaderboardType, string> = {
    total: t("total"),
    auto: t("auto"),
    llm: t("llm"),
    community: t("community"),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        {tc("backHome")}
      </Link>
      <h1 className="mt-4 text-2xl font-bold">{t("title")}</h1>
      <p className="mt-1 text-sm text-gray-500">{t("subtitle")}</p>

      <nav className="mt-6 flex flex-wrap gap-2">
        {TAB_KEYS.map((key) => (
          <Link
            key={key}
            href={`/leaderboard?type=${key}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              validType === key
                ? "bg-indigo-600 text-white"
                : "border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            }`}
          >
            {tabLabels[key]}
          </Link>
        ))}
      </nav>

      <div className="mt-6">
        <LeaderboardTable entries={entries} type={validType} />
      </div>

      <AdSlot position="bottom" className="mt-8" />
    </div>
  );
}
