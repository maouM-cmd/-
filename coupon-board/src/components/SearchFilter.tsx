"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";

export function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") ?? "";
  const currentSearch = searchParams.get("search") ?? "";
  const currentSort = searchParams.get("sort") ?? "new";

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="サービス名・キーワードで検索..."
          defaultValue={currentSearch}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParams({ search: (e.target as HTMLInputElement).value });
            }
          }}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />
        <select
          value={currentSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-400"
        >
          <option value="new">新着順</option>
          <option value="popular">人気順</option>
          <option value="referrer">紹介者特典が大きい順</option>
          <option value="referee">被紹介者特典が大きい順</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <CategoryChip
          label="すべて"
          active={!currentCategory}
          onClick={() => updateParams({ category: "" })}
        />
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat.value}
            label={`${cat.emoji} ${cat.label}`}
            active={currentCategory === cat.value}
            onClick={() => updateParams({ category: cat.value })}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-violet-600 text-white shadow-sm"
          : "border border-gray-200 bg-white text-gray-600 hover:border-violet-200 hover:bg-violet-50"
      }`}
    >
      {label}
    </button>
  );
}
