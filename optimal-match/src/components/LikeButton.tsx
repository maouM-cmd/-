"use client";

import { useState } from "react";

export function LikeButton({
  profileId,
  initialLiked,
  onMutual,
}: {
  profileId: number;
  initialLiked: boolean;
  onMutual?: () => void;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);
  const [mutual, setMutual] = useState(false);

  async function toggle() {
    setLoading(true);
    if (liked) {
      await fetch(`/api/likes?profile_id=${profileId}`, { method: "DELETE" });
      setLiked(false);
      setMutual(false);
    } else {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_id: profileId }),
      });
      const data = await res.json();
      setLiked(true);
      if (data.mutual) {
        setMutual(true);
        onMutual?.();
      }
    }
    setLoading(false);
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        className={`w-full rounded-xl py-3 font-bold transition disabled:opacity-50 ${
          liked
            ? "bg-rose-100 text-rose-600 ring-2 ring-rose-300"
            : "bg-rose-500 text-white hover:bg-rose-600"
        }`}
      >
        {loading ? "..." : liked ? "♥ いいね済み" : "♡ いいねする"}
      </button>
      {mutual && (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-center text-sm font-bold text-emerald-700">
          🎉 マッチ成立！お互いにいいねしています
        </p>
      )}
    </div>
  );
}
