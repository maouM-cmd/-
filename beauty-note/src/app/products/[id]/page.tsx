import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, seedIfEmpty } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { ProductForm } from "@/components/ProductForm";
import { PinToggleButton } from "@/components/PinToggleButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  seedIfEmpty();
  const { id } = await params;
  const { edit } = await searchParams;
  const product = getProductById(Number(id));

  if (!product) notFound();

  return (
    <main className="px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <Link href="/products" className="text-sm text-[#a88668]">
          ← 一覧へ
        </Link>
        <div className="flex gap-2">
          <PinToggleButton productId={product.id} pinned={product.is_pinned} />
          <Link
            href={`/products/${product.id}?edit=1`}
            className="rounded-full border border-[#eadfd4] px-3 py-1.5 text-xs font-semibold text-[#a88668]"
          >
            編集
          </Link>
        </div>
      </header>

      {edit === "1" ? (
        <>
          <h1 className="mb-6 text-2xl font-bold">商品を編集</h1>
          <ProductForm product={product} />
        </>
      ) : (
        <ProductCard product={product} />
      )}
    </main>
  );
}
