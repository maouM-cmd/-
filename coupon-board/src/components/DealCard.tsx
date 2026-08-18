import Image from "next/image";
import Link from "next/link";
import type { Deal } from "@/lib/types";
import { getCategoryEmoji, getCategoryLabel } from "@/lib/constants";
import { getScreenshotUrl } from "@/lib/screenshot";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isExpired(expiresAt: string | null) {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

export function DealCard({ deal }: { deal: Deal }) {
  const expired = isExpired(deal.expires_at);
  const screenshotUrl = getScreenshotUrl(deal.screenshot_path);

  return (
    <Link
      href={`/deal/${deal.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm transition hover:border-violet-200 hover:shadow-md"
    >
      {screenshotUrl && (
        <div className="relative h-36 w-full shrink-0 bg-gray-50">
          <Image
            src={screenshotUrl}
            alt={`${deal.service_name}のスクリーンショット`}
            fill
            className="object-cover object-top"
            unoptimized
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-xl">{getCategoryEmoji(deal.category)}</span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-violet-600">
                {getCategoryLabel(deal.category)}
              </p>
              <h2 className="line-clamp-2 font-bold text-gray-900 group-hover:text-violet-600">
                {deal.service_name}
              </h2>
            </div>
          </div>
          {expired && (
            <span className="shrink-0 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-500">
              期限切れ?
            </span>
          )}
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-violet-50 px-3 py-2">
            <p className="text-[10px] font-medium text-violet-500">紹介する側</p>
            <p className="line-clamp-2 text-sm font-bold text-violet-700">
              {deal.referrer_reward}
            </p>
          </div>
          <div className="rounded-xl bg-fuchsia-50 px-3 py-2">
            <p className="text-[10px] font-medium text-fuchsia-500">登録する側</p>
            <p className="line-clamp-2 text-sm font-bold text-fuchsia-700">
              {deal.referee_reward}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1 text-xs text-gray-500">
          <span className="truncate">投稿: {deal.author_name}</span>
          <div className="flex shrink-0 items-center gap-3">
            <span>👍 {deal.helpful_count}</span>
            <span>{formatDate(deal.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
