import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { CommentSection } from "@/components/CommentSection";
import { CopyCodeButton } from "@/components/CopyCodeButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { HelpfulButton } from "@/components/HelpfulButton";
import { ReportButton } from "@/components/ReportButton";
import { UsageReportButtons } from "@/components/UsageReportButtons";
import { getCategoryEmoji, getCategoryLabel } from "@/lib/constants";
import { getDealById, seedIfEmpty } from "@/lib/db";
import { getScreenshotUrl } from "@/lib/screenshot";

interface DealPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DealPage({ params }: DealPageProps) {
  seedIfEmpty();
  const { id } = await params;
  const deal = getDealById(Number(id));

  if (!deal) {
    notFound();
  }

  const screenshotUrl = getScreenshotUrl(deal.screenshot_path);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/"
        className="text-sm text-violet-600 hover:text-violet-700"
      >
        ← 一覧に戻る
      </Link>

      <AdSlot position="top" className="mt-4" />

      <article className="mt-4 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-2xl">{getCategoryEmoji(deal.category)}</span>
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
            {getCategoryLabel(deal.category)}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">{deal.service_name}</h1>

        {screenshotUrl ? (
          <div className="mt-5 overflow-hidden rounded-xl border border-violet-100">
            <Image
              src={screenshotUrl}
              alt="キャンペーンスクリーンショット"
              width={800}
              height={600}
              className="h-auto w-full object-contain bg-gray-50"
              unoptimized
            />
          </div>
        ) : (
          <p className="mt-3 text-xs text-amber-600">
            📷 スクリーンショットは未添付です
          </p>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 p-4">
            <p className="text-xs font-medium text-violet-600">紹介する側の特典</p>
            <p className="mt-1 text-xl font-bold text-violet-800">
              {deal.referrer_reward}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 p-4">
            <p className="text-xs font-medium text-fuchsia-600">登録する側の特典</p>
            <p className="mt-1 text-xl font-bold text-fuchsia-800">
              {deal.referee_reward}
            </p>
          </div>
        </div>

        {deal.referral_code && (
          <div className="mt-5 rounded-xl border border-dashed border-violet-200 bg-violet-50/50 p-4">
            <p className="text-xs font-medium text-gray-500">招待コード</p>
            <p className="mt-1 font-mono text-lg font-bold text-gray-900">
              {deal.referral_code}
            </p>
          </div>
        )}

        {deal.conditions && (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">利用条件</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
              {deal.conditions}
            </p>
          </div>
        )}

        {deal.description && (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">補足</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
              {deal.description}
            </p>
          </div>
        )}

        <div className="mt-6">
          <UsageReportButtons
            dealId={deal.id}
            initialWorked={deal.worked_count}
            initialFailed={deal.failed_count}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500">
          {deal.expires_at && (
            <span>
              期限: {new Date(deal.expires_at).toLocaleDateString("ja-JP")}
            </span>
          )}
          <span>投稿者: {deal.author_name}</span>
          <span>投稿日: {formatDate(deal.created_at)}</span>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {deal.referral_link && (
            <a
              href={deal.referral_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-fuchsia-600"
            >
              招待リンクを開く ↗
            </a>
          )}
          {deal.referral_code && <CopyCodeButton code={deal.referral_code} />}
          <FavoriteButton dealId={deal.id} />
          <HelpfulButton dealId={deal.id} initialCount={deal.helpful_count} />
        </div>

        <CommentSection dealId={deal.id} />

        <div className="mt-6 border-t border-gray-100 pt-4 text-center">
          <ReportButton dealId={deal.id} />
        </div>
      </article>

      <AdSlot position="bottom" className="mt-6" />
    </div>
  );
}
