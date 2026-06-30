import { Suspense } from "react";
import { AdSlot } from "@/components/AdSlot";
import { DealCard } from "@/components/DealCard";
import { SearchFilter } from "@/components/SearchFilter";
import { getAllDeals, seedIfEmpty } from "@/lib/db";
import type { Category, SortOption } from "@/lib/types";

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

  const deals = getAllDeals({
    category: params.category as Category | undefined,
    search: params.search,
    sort: (params.sort as SortOption) ?? "new",
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <section className="mb-8 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 p-8 text-white shadow-lg shadow-violet-200">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
          お得な招待キャンペーンを探そう
        </h1>
        <p className="text-violet-100">
          紹介する側・登録する側、双方の特典がわかる招待案件まとめ
        </p>
        <p className="mt-3 text-sm text-violet-200">
          現在 {deals.length} 件の案件が掲載されています
        </p>
      </section>

      <AdSlot position="inline" className="mb-8" />

      <Suspense fallback={<div className="h-24 animate-pulse rounded-xl bg-gray-100" />}>
        <SearchFilter />
      </Suspense>

      <section className="mt-8">
        {deals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-violet-200 bg-white py-16 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-3 font-medium text-gray-700">
              該当する案件が見つかりませんでした
            </p>
            <p className="mt-1 text-sm text-gray-500">
              検索条件を変えるか、あなたの招待リンクを投稿してみましょう
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
