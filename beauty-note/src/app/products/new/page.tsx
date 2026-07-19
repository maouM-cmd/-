import { ProductForm } from "@/components/ProductForm";
import { seedIfEmpty } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  seedIfEmpty();

  return (
    <main className="px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">商品を追加</h1>
        <p className="mt-2 text-sm text-[#6b6560]">
          社内の商品表から必要な情報だけ抜き出して登録しよう。
        </p>
      </header>
      <ProductForm />
    </main>
  );
}
