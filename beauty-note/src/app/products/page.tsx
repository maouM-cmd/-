import Link from "next/link";
import { getAllProducts, seedIfEmpty } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { ProductSearch } from "@/components/ProductSearch";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  seedIfEmpty();
  const params = await searchParams;
  const products = getAllProducts({ search: params.q });

  return (
    <main className="px-4 py-6">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">商品ノート</h1>
          <p className="mt-2 text-sm text-[#6b6560]">
            店の商品を自分用に登録。ピン留めした商品が今日の暗記対象になります。
          </p>
        </div>
        <Link
          href="/products/new"
          className="shrink-0 rounded-full bg-[#c4a484] px-4 py-2 text-sm font-semibold text-white"
        >
          ＋ 追加
        </Link>
      </header>

      <ProductSearch initialQuery={params.q ?? ""} />

      <section className="mt-6 space-y-4">
        {products.length === 0 ? (
          <p className="text-center text-sm text-[#6b6560]">商品がありません</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} showProgress />
          ))
        )}
      </section>
    </main>
  );
}
