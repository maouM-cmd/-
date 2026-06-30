"use client";

import { useState } from "react";

function getStoredVote(dealId: number): "worked" | "failed" | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(`usage_${dealId}`);
  return stored === "worked" || stored === "failed" ? stored : null;
}

export function UsageReportButtons({
  dealId,
  initialWorked,
  initialFailed,
}: {
  dealId: number;
  initialWorked: number;
  initialFailed: number;
}) {
  const [worked, setWorked] = useState(initialWorked);
  const [failed, setFailed] = useState(initialFailed);
  const [voted, setVoted] = useState<"worked" | "failed" | null>(
    () => getStoredVote(dealId)
  );
  const [loading, setLoading] = useState(false);

  async function submit(type: "worked" | "failed") {
    if (voted || loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/deals/${dealId}/usage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (res.ok) {
        const data = await res.json();
        setWorked(data.worked_count);
        setFailed(data.failed_count);
        setVoted(type);
        localStorage.setItem(`usage_${dealId}`, type);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
      <p className="mb-3 text-sm font-medium text-gray-700">
        この招待、使えましたか？
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => submit("worked")}
          disabled={!!voted || loading}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            voted === "worked"
              ? "bg-green-100 text-green-700"
              : "border border-green-200 bg-white text-gray-700 hover:bg-green-50 disabled:opacity-50"
          }`}
        >
          ✓ 使えた {worked}
        </button>
        <button
          onClick={() => submit("failed")}
          disabled={!!voted || loading}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            voted === "failed"
              ? "bg-gray-200 text-gray-700"
              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          }`}
        >
          ✗ 使えなかった {failed}
        </button>
      </div>
    </div>
  );
}
