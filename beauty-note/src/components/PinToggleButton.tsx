"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PinToggleButton({
  productId,
  pinned,
}: {
  productId: number;
  pinned: boolean;
}) {
  const router = useRouter();
  const [isPinned, setIsPinned] = useState(pinned);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle_pin" }),
    });
    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      setIsPinned(data.is_pinned);
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        isPinned
          ? "bg-[#c4a484] text-white"
          : "border border-[#eadfd4] text-[#a88668]"
      }`}
    >
      {isPinned ? "今日の対象 ✓" : "今日覚える"}
    </button>
  );
}
