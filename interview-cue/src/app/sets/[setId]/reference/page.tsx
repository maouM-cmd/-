"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { DisplayModeToggle } from "@/components/DisplayModeToggle";
import { useAppData } from "@/hooks/useAppData";
import type { DisplayMode } from "@/lib/types";
import { formatSeconds } from "@/lib/utils";

export default function ReferencePage() {
  const params = useParams<{ setId: string }>();
  const { data } = useAppData();
  const [displayMode, setDisplayMode] = useState<DisplayMode>("keypoints");
  const [view, setView] = useState<"list" | "single">("list");
  const [index, setIndex] = useState(0);
  const [fontSize, setFontSize] = useState<"md" | "lg" | "xl">("lg");

  const set = data?.sets.find((entry) => entry.id === params.setId);
  const items = set ? [...set.items].sort((a, b) => a.order - b.order) : [];
  const item = items[index];

  const fontSizeClass = {
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }[fontSize];

  if (!set || items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-slate-600">参照する質問がありません</p>
        <Link href={`/sets/${params.setId}`} className="mt-4 inline-block text-sky-600">
          一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-57px)] bg-slate-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="flex items-center justify-between">
          <Link
            href={`/sets/${set.id}`}
            className="text-sm text-sky-300 hover:underline"
          >
            ← 終了
          </Link>
          <p className="text-xs text-slate-400">{set.name}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <DisplayModeToggle mode={displayMode} onChange={setDisplayMode} />
          <div className="inline-flex rounded-xl bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => setView("list")}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                view === "list" ? "bg-slate-600" : "text-slate-400"
              }`}
            >
              一覧
            </button>
            <button
              type="button"
              onClick={() => setView("single")}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                view === "single" ? "bg-slate-600" : "text-slate-400"
              }`}
            >
              1問表示
            </button>
          </div>
          <div className="inline-flex rounded-xl bg-slate-800 p-1">
            {(["md", "lg", "xl"] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setFontSize(size)}
                className={`rounded-lg px-2.5 py-1.5 text-xs uppercase ${
                  fontSize === size ? "bg-slate-600" : "text-slate-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {view === "list" ? (
          <div className="mt-6 space-y-4 pb-8">
            {items.map((entry, itemIndex) => {
              const text =
                displayMode === "keypoints" ? entry.keyPoints : entry.fullText;
              return (
                <article
                  key={entry.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-sky-200">
                      {itemIndex + 1}. {entry.question}
                    </h3>
                    <span className="shrink-0 text-xs text-slate-500">
                      {formatSeconds(entry.targetSeconds)}
                    </span>
                  </div>
                  <p
                    className={`mt-3 whitespace-pre-wrap leading-relaxed text-slate-100 ${fontSizeClass}`}
                  >
                    {text.trim() || "（未入力）"}
                  </p>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 pb-8">
            <p className="text-sm text-slate-400">
              {index + 1} / {items.length}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-sky-100">
              {item.question}
            </h2>
            <p
              className={`mt-6 whitespace-pre-wrap leading-loose text-slate-100 ${fontSizeClass}`}
            >
              {(displayMode === "keypoints" ? item.keyPoints : item.fullText).trim() ||
                "（未入力）"}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIndex((current) => (current - 1 + items.length) % items.length)}
                className="rounded-2xl bg-slate-800 py-4 text-sm font-semibold"
              >
                前へ
              </button>
              <button
                type="button"
                onClick={() => setIndex((current) => (current + 1) % items.length)}
                className="rounded-2xl bg-sky-700 py-4 text-sm font-semibold"
              >
                次へ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
