import { getAllProducts, getShiftLogs, seedIfEmpty } from "@/lib/db";
import { ShiftLogForm } from "@/components/ShiftLogForm";

export const dynamic = "force-dynamic";

export default function LogPage() {
  seedIfEmpty();
  const products = getAllProducts();
  const logs = getShiftLogs(10);

  return (
    <main className="px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">退勤メモ</h1>
        <p className="mt-2 text-sm text-[#6b6560]">
          仕事中に書けなかったことを、帰宅後60秒で記録。
        </p>
      </header>

      <ShiftLogForm products={products} />

      {logs.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold">最近の記録</h2>
          <div className="space-y-3">
            {logs.map((log) => (
              <article
                key={log.id}
                className="rounded-2xl border border-[#eadfd4] bg-white p-4 text-sm"
              >
                <p className="text-xs text-[#6b6560]">{log.created_at}</p>
                {log.product_name && (
                  <p className="mt-1 font-semibold">
                    {log.brand} / {log.product_name}
                  </p>
                )}
                {log.learned_note && (
                  <p className="mt-2 text-[#4a4541]">{log.learned_note}</p>
                )}
                {log.struggled_ingredient && (
                  <p className="mt-2 text-amber-800">
                    つまずき: {log.struggled_ingredient}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
