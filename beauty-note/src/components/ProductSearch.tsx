"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ブランド・商品名・成分で検索"
        className="flex-1 rounded-xl border border-[#eadfd4] px-4 py-3 text-sm"
      />
      <button
        type="submit"
        className="rounded-xl bg-white px-4 text-sm font-semibold text-[#a88668] ring-1 ring-[#eadfd4]"
      >
        検索
      </button>
    </form>
  );
}
