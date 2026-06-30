"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Deal } from "@/lib/types";
import { DealCard } from "@/components/DealCard";
import { getFavoriteIds } from "@/lib/favorites";

export function FavoritesList() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(
    () => typeof window !== "undefined" && getFavoriteIds().length > 0
  );
  const favoriteIds =
    typeof window !== "undefined" ? getFavoriteIds() : [];

  useEffect(() => {
    const ids = getFavoriteIds();
    if (ids.length === 0) return;

    fetch(`/api/deals?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data) => setDeals(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="h-32 animate-pulse rounded-xl bg-gray-100" />;
  }

  if (favoriteIds.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-violet-200 bg-white py-16 text-center">
        <p className="text-4xl">☆</p>
        <p className="mt-3 font-medium text-gray-700">お気に入りはまだありません</p>
        <p className="mt-1 text-sm text-gray-500">
          案件詳細の「お気に入り」ボタンで保存できます
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-violet-600 hover:underline"
        >
          案件を探す →
        </Link>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-violet-200 bg-white py-16 text-center">
        <p className="font-medium text-gray-700">
          保存した案件は期限切れまたは非表示になりました
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
}
