import Link from "next/link";
import {
  getPinnedProducts,
  getSettings,
  getStudyStats,
  seedIfEmpty,
} from "@/lib/db";
import { SITE_TAGLINE } from "@/lib/ingredients";
import { ProductCard } from "@/components/ProductCard";
import { WelcomeModal } from "@/components/WelcomeModal";

export const dynamic = "force-dynamic";

export default function HomePage() {
  seedIfEmpty();
  const products = getPinnedProducts();
  const stats = getStudyStats();
  const settings = getSettings();
  const displayName = settings.staff_name || "あなた";

  return (
    <main className="px-4 py-6">
      <WelcomeModal
        staffName={settings.staff_name}
        seen={settings.welcome_seen}
      />

      <header className="mb-6">
        <p className="text-sm text-[#a88668]">おはよう、{displayName}さん</p>
        <h1 className="mt-1 text-2xl font-bold leading-tight">
          今日はこの{products.length || 5}つだけ
          <br />
          覚えればOK
        </h1>
        <p className="mt-2 text-sm text-[#6b6560]">{SITE_TAGLINE}</p>
      </header>

      <section className="mb-6 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-[#eadfd4]">
          <p className="text-lg font-bold text-[#a88668]">{stats.pinnedCount}</p>
          <p className="text-[11px] text-[#6b6560]">ピン留め</p>
        </div>
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-[#eadfd4]">
          <p className="text-lg font-bold text-[#a88668]">{stats.studiedToday}</p>
          <p className="text-[11px] text-[#6b6560]">今日暗記</p>
        </div>
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-[#eadfd4]">
          <p className="text-lg font-bold text-[#a88668]">
            {stats.averageProgress}%
          </p>
          <p className="text-[11px] text-[#6b6560]">平均進捗</p>
        </div>
      </section>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/study"
          className="flex-1 rounded-2xl bg-[#c4a484] px-4 py-4 text-center text-sm font-semibold text-white shadow-sm"
        >
          暗記モードをはじめる
        </Link>
        <Link
          href="/print"
          className="flex-1 rounded-2xl border border-[#c4a484] bg-white px-4 py-4 text-center text-sm font-semibold text-[#a88668] shadow-sm"
        >
          成分シートを印刷
        </Link>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">今日の商品</h2>
          <Link href="/products" className="text-sm text-[#a88668]">
            すべて見る
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9c8b8] bg-white p-6 text-center text-sm text-[#6b6560]">
            ピン留め商品がありません。
            <Link href="/products" className="mt-2 block font-semibold text-[#a88668]">
              商品を登録する
            </Link>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} showProgress />
          ))
        )}
      </section>

      <section className="mt-8">
        <Link
          href="/log"
          className="block rounded-2xl border border-[#eadfd4] bg-white p-4 text-center text-sm text-[#6b6560] shadow-sm"
        >
          退勤した？ 今日のメモを残す →
        </Link>
      </section>
    </main>
  );
}
