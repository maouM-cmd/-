import Link from "next/link";
import { notFound } from "next/navigation";
import { HelpfulButton } from "@/components/HelpfulButton";
import { getCategoryEmoji, getCategoryLabel } from "@/lib/constants";
import { getCouponById, seedIfEmpty } from "@/lib/db";

interface CouponPageProps {
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

export default async function CouponPage({ params }: CouponPageProps) {
  seedIfEmpty();
  const { id } = await params;
  const coupon = getCouponById(Number(id));

  if (!coupon) {
    notFound();
  }

  const expired =
    coupon.expires_at && new Date(coupon.expires_at) < new Date();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/"
        className="text-sm text-orange-600 hover:text-orange-700"
      >
        ← 一覧に戻る
      </Link>

      <article className="mt-4 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-2xl">{getCategoryEmoji(coupon.category)}</span>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
            {getCategoryLabel(coupon.category)}
          </span>
          {expired && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
              期限切れの可能性あり
            </span>
          )}
        </div>

        <p className="text-sm font-medium text-orange-600">
          {coupon.service_name}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">{coupon.title}</h1>

        <div className="mt-4 inline-block rounded-xl bg-gradient-to-r from-orange-100 to-rose-100 px-5 py-3">
          <p className="text-xs text-orange-600">割引内容</p>
          <p className="text-xl font-bold text-orange-700">{coupon.discount}</p>
        </div>

        {coupon.coupon_code && (
          <div className="mt-4 rounded-xl border border-dashed border-orange-200 bg-orange-50/50 p-4">
            <p className="text-xs font-medium text-gray-500">クーポンコード</p>
            <p className="mt-1 font-mono text-lg font-bold text-gray-900">
              {coupon.coupon_code}
            </p>
          </div>
        )}

        {coupon.description && (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">詳細</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
              {coupon.description}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500">
          {coupon.expires_at && (
            <span>
              有効期限:{" "}
              {new Date(coupon.expires_at).toLocaleDateString("ja-JP")}
            </span>
          )}
          <span>投稿者: {coupon.author_name}</span>
          <span>投稿日: {formatDate(coupon.created_at)}</span>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={coupon.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-200 transition hover:from-orange-600 hover:to-rose-600"
          >
            サービスを開く ↗
          </a>
          <HelpfulButton
            couponId={coupon.id}
            initialCount={coupon.helpful_count}
          />
        </div>
      </article>
    </div>
  );
}
