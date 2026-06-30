import { Suspense } from "react";
import { CouponCard } from "@/components/CouponCard";
import { SearchFilter } from "@/components/SearchFilter";
import { getAllCoupons, seedIfEmpty } from "@/lib/db";
import type { Category } from "@/lib/types";

interface HomeProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  seedIfEmpty();
  const params = await searchParams;

  const coupons = getAllCoupons({
    category: params.category as Category | undefined,
    search: params.search,
    sort: (params.sort as "new" | "popular") ?? "new",
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <section className="mb-8 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 p-8 text-white shadow-lg shadow-orange-200">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
          お得な初回クーポンを探そう
        </h1>
        <p className="text-orange-100">
          新規登録特典・初回割引・クーポンコードをみんなで共有する掲示板です
        </p>
        <p className="mt-3 text-sm text-orange-200">
          現在 {coupons.length} 件のクーポンが掲載されています
        </p>
      </section>

      <Suspense fallback={<div className="h-24 animate-pulse rounded-xl bg-gray-100" />}>
        <SearchFilter />
      </Suspense>

      <section className="mt-8">
        {coupons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-orange-200 bg-white py-16 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-3 font-medium text-gray-700">
              該当するクーポンが見つかりませんでした
            </p>
            <p className="mt-1 text-sm text-gray-500">
              検索条件を変えるか、新しいクーポンを投稿してみましょう
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {coupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
