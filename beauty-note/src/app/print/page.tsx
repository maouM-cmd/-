import Link from "next/link";
import { getAllFaq, getPinnedProducts, getSettings, seedIfEmpty } from "@/lib/db";
import { PrintSheet } from "@/components/PrintSheet";
import { PrintButton } from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export default function PrintPage() {
  seedIfEmpty();
  const products = getPinnedProducts();
  const faq = getAllFaq();
  const settings = getSettings();

  return (
    <main>
      <div className="no-print px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">成分チートシート</h1>
          <p className="mt-2 text-sm text-[#6b6560]">
            仕事中にスマホが見れないとき用。印刷するかPDFに保存してポケットへ。
          </p>
        </header>

        <PrintButton />

        <Link href="/" className="mt-4 block text-center text-sm text-[#a88668]">
          ← 今日の画面へ戻る
        </Link>
      </div>

      <PrintSheet
        products={products}
        faq={faq}
        staffName={settings.staff_name}
        shopName={settings.shop_name}
        cheerMessage={settings.cheer_message}
      />
    </main>
  );
}
