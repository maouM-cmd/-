"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { mapApiError } from "@/lib/map-api-error";

export function RatingStars({
  submissionId,
  currentRating,
  canRate,
}: {
  submissionId: number;
  currentRating: number | null;
  canRate: boolean;
}) {
  const router = useRouter();
  const t = useTranslations();
  const tr = useTranslations("rating");
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(currentRating);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRate(stars: number) {
    if (!canRate) return;
    setLoading(true);
    setError("");
    const res = await fetch(`/api/submissions/${submissionId}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stars }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(mapApiError(data, t));
      return;
    }
    setRating(stars);
    router.refresh();
  }

  if (!canRate) {
    return (
      <p className="text-sm text-gray-500">
        {rating
          ? tr("yourRating", { rating })
          : tr("cannotRateOwn")}
      </p>
    );
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-700">{tr("title")}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={loading}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRate(star)}
            className="text-2xl transition hover:scale-110 disabled:opacity-50"
          >
            <span
              className={
                star <= (hover || rating || 0)
                  ? "text-amber-400"
                  : "text-gray-300"
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>
      {rating && (
        <p className="mt-1 text-xs text-gray-500">{tr("yourRating", { rating })}</p>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function CopyLinkButton({ path }: { path: string }) {
  const tr = useTranslations("rating");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}${path}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
    >
      {copied ? tr("copied") : tr("copyLink")}
    </button>
  );
}
