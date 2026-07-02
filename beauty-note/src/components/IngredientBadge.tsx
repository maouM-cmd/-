import { INGREDIENT_TAG_MAP } from "@/lib/ingredients";
import type { IngredientTagId } from "@/lib/types";

const TONE_CLASS = {
  positive: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  caution: "bg-amber-50 text-amber-900 ring-amber-200",
};

export function IngredientBadge({ tagId }: { tagId: IngredientTagId }) {
  const tag = INGREDIENT_TAG_MAP[tagId];
  if (!tag) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${TONE_CLASS[tag.tone]}`}
    >
      {tag.label}
    </span>
  );
}

export function IngredientBadgeList({ tags }: { tags: IngredientTagId[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <IngredientBadge key={tag} tagId={tag} />
      ))}
    </div>
  );
}
