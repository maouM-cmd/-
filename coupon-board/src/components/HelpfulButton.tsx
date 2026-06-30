"use client";

import { useState } from "react";

export function HelpfulButton({
  dealId,
  initialCount,
}: {
  dealId: number;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (voted || loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/deals/${dealId}`, { method: "PATCH" });
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
          ? "bg-violet-100 text-violet-700"
          : "border border-violet-200 bg-white text-gray-700 hover:border-violet-300 hover:bg-violet-50"
      }`}
    >
      👍 役に立った {count}
      {voted && <span className="text-xs">（ありがとう！）</span>}
    </button>
  );
}
