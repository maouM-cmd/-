"use client";

import { useLocale } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import type { Category, Challenge, Tag } from "@/lib/types";
import { ChallengeCard } from "./ChallengeCard";
import { OfflineBanner } from "./OfflineBanner";

export function ChallengeFilter({
  initialChallenges,
  initialCategories,
  categoryLabel,
  allLabel,
  countLabel,
  emptyLabel,
  offlineHint,
}: {
  initialChallenges: Challenge[];
  initialCategories: Category[];
  categoryLabel: (category: Category) => string;
  allLabel: string;
  countLabel: (n: number) => string;
  emptyLabel: string;
  offlineHint: string;
}) {
  const locale = useLocale();
  const [challenges, setChallenges] = useState(initialChallenges);
  const [categories] = useState(initialCategories);
  const [tags, setTags] = useState<Tag[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(
    () => typeof navigator !== "undefined" && !navigator.onLine,
  );

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then((d) => setTags(d.tags ?? []))
      .catch(() => {});
  }, []);

  const loadChallenges = useCallback(async (cat: string | null, tagName: string | null) => {
    setLoading(true);
    const isOffline = !navigator.onLine;
    setOffline(isOffline);

    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (tagName) params.set("tag", tagName);
    params.set("locale", locale);

    try {
      const res = await fetch(`/api/challenges?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setChallenges(data.challenges ?? []);
        setOffline(false);
      } else if (isOffline) {
        setOffline(true);
      }
    } catch {
      if (isOffline) setOffline(true);
    }

    setLoading(false);
  }, [locale]);

  function selectCategory(slug: string | null) {
    setCategory(slug);
    void loadChallenges(slug, tag);
  }

  function selectTag(name: string | null) {
    setTag(name);
    void loadChallenges(category, name);
  }

  useEffect(() => {
    function handleOnline() {
      setOffline(false);
      void loadChallenges(category, tag);
    }
    function handleOffline() {
      setOffline(true);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [category, tag, loadChallenges]);

  return (
    <section className="mt-8">
      {offline && <OfflineBanner message={offlineHint} className="mb-4" />}

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => selectCategory(null)}
          className={`rounded-full px-3 py-1.5 text-sm ${
            category === null
              ? "bg-indigo-600 text-white"
              : "border border-indigo-200 text-indigo-700"
          }`}
        >
          {allLabel}
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectCategory(c.slug)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              category === c.slug
                ? "bg-indigo-600 text-white"
                : "border border-indigo-200 text-indigo-700"
            }`}
          >
            {categoryLabel(c)}
          </button>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTag(tag === t.name ? null : t.name)}
              className={`rounded-full px-2.5 py-1 text-xs ${
                tag === t.name
                  ? "bg-cyan-600 text-white"
                  : "bg-cyan-50 text-cyan-700"
              }`}
            >
              #{t.name}
            </button>
          ))}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{allLabel}</h2>
        <span className="text-sm text-gray-500">
          {loading ? "..." : countLabel(challenges.length)}
        </span>
      </div>

      {challenges.length === 0 ? (
        <p className="rounded-xl border border-dashed py-12 text-center text-gray-500">
          {emptyLabel}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((c) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              categoryLabel={
                c.category ? categoryLabel(c.category) : undefined
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
