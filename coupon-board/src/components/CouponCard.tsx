import Link from "next/link";
import type { Coupon } from "@/lib/types";
import { getCategoryEmoji, getCategoryLabel } from "@/lib/constants";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isExpired(expiresAt: string | null) {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

export function CouponCard({ coupon }: { coupon: Coupon }) {
  const expired = isExpired(coupon.expires_at);

  return (
    <Link
      href={`/coupon/${coupon.id}`}
      className="group block rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getCategoryEmoji(coupon.category)}</span>
          <div>
            <p className="text-xs font-medium text-orange-600">
              {getCategoryLabel(coupon.category)}
            </p>
            <h2 className="font-bold text-gray-900 group-hover:text-orange-600">
              {coupon.service_name}
            </h2>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
            expired
              ? "bg-gray-100 text-gray-500"
              : "bg-gradient-to-r from-orange-100 to-rose-100 text-orange-700"
          }`}
        >
          {coupon.discount}
        </span>
      </div>

      <p className="mb-3 line-clamp-2 text-sm text-gray-700">{coupon.title}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>投稿: {coupon.author_name}</span>
        <div className="flex items-center gap-3">
          <span>👍 {coupon.helpful_count}</span>
          <span>{formatDate(coupon.created_at)}</span>
        </div>
      </div>

      {expired && (
        <p className="mt-2 text-xs font-medium text-red-500">期限切れの可能性あり</p>
      )}
    </Link>
  );
}
