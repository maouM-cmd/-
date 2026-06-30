"use client";

import { useState } from "react";

export function HelpfulButton({
  couponId,
  initialCount,
}: {
  couponId: number;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (voted || loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/coupons/${couponId}`, { method: "PATCH" });
      if (res.ok) {
        const data = await res.json();
        setCount(data.helpful_count);
        setVoted(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={voted || loading}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
        voted
          ? "bg-orange-100 text-orange-700"
          : "border border-orange-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50"
      }`}
    >
      👍 役に立った {count}
      {voted && <span className="text-xs">（ありがとう！）</span>}
    </button>
  );
}
