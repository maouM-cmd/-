"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { RANK_BG } from "@/lib/constants";
import type { LeaderboardEntry, LeaderboardType } from "@/lib/types";

export function LeaderboardTable({
  entries,
  type = "total",
}: {
  entries: LeaderboardEntry[];
  type?: LeaderboardType;
}) {
  const t = useTranslations("leaderboard");

  if (entries.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">{t("empty")}</p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-indigo-100">
      <table className="w-full text-sm">
        <thead className="bg-indigo-50 text-left text-xs font-medium text-indigo-800">
          <tr>
            <th className="px-4 py-3">{t("rank")}</th>
            <th className="px-4 py-3">{t("author")}</th>
            <th className="px-4 py-3">{t("challenge")}</th>
            <th className="px-4 py-3">{t("overall")}</th>
            <th className="px-4 py-3">{t("autoCol")}</th>
            <th className="px-4 py-3">{t("llmCol")}</th>
            <th className="px-4 py-3">{t("communityCol")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {entries.map((entry, i) => (
            <tr key={entry.submission_id} className="hover:bg-indigo-50/30">
              <td className="px-4 py-3 font-medium text-gray-500">{i + 1}</td>
              <td className="px-4 py-3">{entry.author_name}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/submissions/${entry.submission_id}`}
                  className="text-indigo-600 hover:underline"
                >
                  {entry.challenge_title}
                </Link>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${RANK_BG[entry.rank]}`}
                >
                  {type === "total" ? entry.total_score : "—"}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {type === "auto" || type === "total" ? entry.auto_score : "—"}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {type === "llm" ? (entry.llm_score ?? "—") : (entry.llm_score ?? "—")}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {entry.community_score !== null
                  ? `★${entry.community_score.toFixed(1)} (${entry.rating_count})`
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
