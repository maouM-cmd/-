import { getPinnedProducts, getSettings, seedIfEmpty } from "@/lib/db";
import { FlashCardStudy } from "@/components/FlashCardStudy";

export const dynamic = "force-dynamic";

export default function StudyPage() {
  seedIfEmpty();
  const products = getPinnedProducts();
  const settings = getSettings();

  return (
    <main className="px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">暗記モード</h1>
        <p className="mt-2 text-sm text-[#6b6560]">
          出勤前の5〜10分に。カードをめくって成分とトークを覚えよう。
        </p>
      </header>

      <FlashCardStudy
        products={products}
        cheerMessage={settings.cheer_message}
      />
    </main>
  );
}
