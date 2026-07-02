import { SKIN_TYPE_LABELS } from "@/lib/ingredients";
import { INGREDIENT_TAG_MAP } from "@/lib/ingredients";
import type { IngredientFaq, Product } from "@/lib/types";

export function PrintSheet({
  products,
  faq,
  staffName,
  shopName,
  cheerMessage,
}: {
  products: Product[];
  faq: IngredientFaq[];
  staffName?: string;
  shopName?: string;
  cheerMessage?: string;
}) {
  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <div className="print-sheet mx-auto max-w-4xl bg-white p-4 text-black md:p-8">
      <header className="mb-6 border-b border-black pb-4">
        <h1 className="text-2xl font-bold">コスメノート 成分チートシート</h1>
        <p className="mt-1 text-sm">{today}</p>
        {(staffName || shopName) && (
          <p className="mt-1 text-sm">
            {[shopName, staffName].filter(Boolean).join(" / ")}
          </p>
        )}
      </header>

      <table>
        <thead>
          <tr>
            <th>商品</th>
            <th>主要成分</th>
            <th>肌質</th>
            <th>注意</th>
            <th>一言</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const cautions = product.ingredient_tags
              .filter((t) => INGREDIENT_TAG_MAP[t]?.tone === "caution")
              .map((t) => INGREDIENT_TAG_MAP[t].label);
            const cautionText =
              [product.avoid_for, ...cautions].filter(Boolean).join("、") || "—";

            return (
              <tr key={product.id}>
                <td>
                  <strong>{product.brand}</strong>
                  <br />
                  {product.name}
                  {product.shade ? (
                    <>
                      <br />
                      <span className="text-sm">{product.shade}</span>
                    </>
                  ) : null}
                </td>
                <td>{product.key_ingredients.join(" / ") || "—"}</td>
                <td>
                  {product.skin_types
                    .map((s) => SKIN_TYPE_LABELS[s])
                    .join("、") || "—"}
                </td>
                <td>{cautionText}</td>
                <td>{product.talking_points || "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {faq.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold">成分FAQ</h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <div key={item.id} className="border border-black p-3">
                <p className="font-semibold">Q. {item.question}</p>
                <p className="mt-1 text-sm leading-relaxed">A. {item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {cheerMessage && (
        <footer className="mt-8 border-t border-black pt-4 text-sm italic">
          {cheerMessage}
        </footer>
      )}
    </div>
  );
}
