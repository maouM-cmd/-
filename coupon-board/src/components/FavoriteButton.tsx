"use client";

import { useState } from "react";
import { getFavoriteIds, toggleFavorite } from "@/lib/favorites";

export function FavoriteButton({ dealId }: { dealId: number }) {
  const [active, setActive] = useState(
    () => typeof window !== "undefined" && getFavoriteIds().includes(dealId)
  );

  function handleClick() {
    const nowActive = toggleFavorite(dealId);
    setActive(nowActive);
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-amber-100 text-amber-700"
          : "border border-amber-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50"
      }`}
    >
      {active ? "★ お気に入り済み" : "☆ お気に入り"}
    </button>
  );
}
