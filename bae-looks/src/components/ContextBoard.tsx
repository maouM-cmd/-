"use client";

import { useState } from "react";
import { InterestCard } from "@/components/InterestCard";
import { ItemCard } from "@/components/ItemCard";
import { PlaceCard } from "@/components/PlaceCard";
import {
  CONTEXT_INTERESTS,
  CONTEXT_ITEMS,
  CONTEXT_PLACES,
} from "@/data/context";
import type { ContextLayer } from "@/lib/types";

const TABS: Array<{ id: ContextLayer; label: string; hint: string }> = [
  { id: "item", label: "物", hint: "服・香水・コスメ" },
  { id: "interest", label: "興味", hint: "発言でハマってること" },
  { id: "place", label: "場所", hint: "最近行ったお店" },
];

export function ContextBoard() {
  const [layer, setLayer] = useState<ContextLayer>("item");

  return (
    <section id="context" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">
          Bae context · mock
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          ベイの「今」を、3つの面で見る
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--ink-muted)]">
          服だけじゃなく、発言でハマっていることや行ったお店まで。
          推し活の本体は「物・興味・場所」のセットです。いまはモックで可視化の感触を確認します。
        </p>
      </div>

      <div
        role="tablist"
        aria-label="コンテキストレイヤー"
        className="mt-10 flex flex-wrap gap-2"
      >
        {TABS.map((tab) => {
          const active = layer === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setLayer(tab.id)}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                active
                  ? "border-[var(--accent)] bg-[rgba(61,224,196,0.1)]"
                  : "border-[var(--line)] bg-[rgba(16,20,31,0.65)] hover:border-[rgba(61,224,196,0.35)]"
              }`}
            >
              <span className="font-display block text-lg font-semibold">
                {tab.label}
              </span>
              <span className="mt-0.5 block text-xs text-[var(--ink-muted)]">
                {tab.hint}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8" role="tabpanel">
        {layer === "item" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <p className="text-sm text-[var(--ink-muted)] lg:col-span-2">
              {CONTEXT_ITEMS.length}件 · 着用・愛用の候補（デモ推測）
            </p>
            {CONTEXT_ITEMS.map((item, index) => (
              <div key={item.id} className="space-y-2">
                {(item.sourceLabel || item.observedAt) && (
                  <p className="text-xs text-[var(--ink-muted)]">
                    {item.sourceLabel}
                    {item.observedAt ? ` · @${item.observedAt}` : ""}
                  </p>
                )}
                <ItemCard item={item} index={index} />
              </div>
            ))}
          </div>
        )}

        {layer === "interest" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <p className="text-sm text-[var(--ink-muted)] lg:col-span-2">
              {CONTEXT_INTERESTS.length}件 · 発言から拾った興味（出典必須）
            </p>
            {CONTEXT_INTERESTS.map((event, index) => (
              <InterestCard key={event.id} event={event} index={index} />
            ))}
          </div>
        )}

        {layer === "place" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <p className="text-sm text-[var(--ink-muted)] lg:col-span-2">
              {CONTEXT_PLACES.length}件 · VLOG/移動ログからの訪問候補
            </p>
            {CONTEXT_PLACES.map((event, index) => (
              <PlaceCard key={event.id} event={event} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
