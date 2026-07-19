"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { mapApiError } from "@/lib/map-api-error";
import type { GeneratedChallenge } from "@/lib/types";

export function ChallengeGenButton({
  onGenerated,
}: {
  onGenerated: (challenge: GeneratedChallenge) => void;
}) {
  const t = useTranslations();
  const tg = useTranslations("gen");
  const [theme, setTheme] = useState("");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">(
    "intermediate",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!theme.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/challenges/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme, difficulty }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(mapApiError(data, t));
      return;
    }

    onGenerated(data.challenge);
  }

  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4">
      <p className="text-sm font-medium text-violet-900">{tg("title")}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder={tg("themePlaceholder")}
          className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm"
        />
        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value as "beginner" | "intermediate" | "advanced")
          }
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="beginner">{tg("beginner")}</option>
          <option value="intermediate">{tg("intermediate")}</option>
          <option value="advanced">{tg("advanced")}</option>
        </select>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !theme.trim()}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {loading ? tg("generating") : tg("generate")}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
