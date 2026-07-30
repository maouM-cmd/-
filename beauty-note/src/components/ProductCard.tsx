import Link from "next/link";
import { CATEGORY_LABELS, SKIN_TYPE_LABELS } from "@/lib/ingredients";
import type { Product } from "@/lib/types";
import { IngredientBadgeList } from "./IngredientBadge";

export function ProductCard({
  product,
  showProgress = false,
  compact = false,
}: {
  product: Product;
  showProgress?: boolean;
  compact?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-[#eadfd4] bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#a88668]">{product.brand}</p>
          <h3 className="text-base font-bold text-[#2d2a26]">
            <Link href={`/products/${product.id}`} className="hover:underline">
              {product.name}
            </Link>
          </h3>
          {product.shade && (
            <p className="text-sm text-[#6b6560]">色番・容量: {product.shade}</p>
          )}
        </div>
        {product.is_pinned && (
          <span className="rounded-full bg-[#f6ebe1] px-2 py-0.5 text-[11px] font-semibold text-[#a88668]">
            今日
          </span>
        )}
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5 text-[11px] text-[#6b6560]">
        <span className="rounded-md bg-[#fff4ec] px-2 py-0.5">
          {CATEGORY_LABELS[product.category]}
        </span>
        {product.skin_types.map((skin) => (
          <span key={skin} className="rounded-md bg-[#f7f7f7] px-2 py-0.5">
            {SKIN_TYPE_LABELS[skin]}
          </span>
        ))}
      </div>

      {!compact && product.key_ingredients.length > 0 && (
        <div className="mb-3">
          <p className="mb-1 text-xs font-semibold text-[#6b6560]">主要成分</p>
          <p className="text-sm leading-relaxed">
            {product.key_ingredients.join(" / ")}
          </p>
        </div>
      )}

      <IngredientBadgeList tags={product.ingredient_tags} />

      {!compact && product.talking_points && (
        <p className="mt-3 rounded-xl bg-[#fff9f5] p-3 text-sm leading-relaxed text-[#4a4541]">
          {product.talking_points}
        </p>
      )}

      {product.avoid_for && !compact && (
        <p className="mt-2 text-xs text-amber-800">注意: {product.avoid_for}</p>
      )}

      {showProgress && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs text-[#6b6560]">
            <span>暗記進捗</span>
            <span>{product.study_progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#f0e8df]">
            <div
              className="h-full rounded-full bg-[#c4a484] transition-all"
              style={{ width: `${product.study_progress}%` }}
            />
          </div>
        </div>
      )}
    </article>
  );
}
