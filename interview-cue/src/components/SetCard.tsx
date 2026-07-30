import Link from "next/link";
import type { ScriptSet } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/utils";

interface SetCardProps {
  set: ScriptSet;
}

export function SetCard({ set }: SetCardProps) {
  const completedCount = set.items.filter(
    (item) => item.keyPoints.trim() || item.fullText.trim(),
  ).length;

  return (
    <Link
      href={`/sets/${set.id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-sky-700">
            {CATEGORY_LABELS[set.category]}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{set.name}</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
          {completedCount}/{set.items.length} 問
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-500">
        更新: {new Date(set.updatedAt).toLocaleDateString("ja-JP")}
      </p>
    </Link>
  );
}
