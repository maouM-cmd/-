"use client";

import { useMemo, useState, useTransition } from "react";
import { ItemCard } from "@/components/ItemCard";
import { DEMO_MOMENTS } from "@/data/moments";
import type { DemoMoment } from "@/lib/types";

const TONE_CLASS: Record<DemoMoment["frameTone"], string> = {
  stage:
    "from-[#2a1848] via-[#14102a] to-[#07090f] [background-image:radial-gradient(circle_at_70%_30%,rgba(255,120,180,0.35),transparent_40%),radial-gradient(circle_at_30%_70%,rgba(61,224,196,0.2),transparent_35%)]",
  airport:
    "from-[#123048] via-[#0d1c28] to-[#07090f] [background-image:linear-gradient(120deg,rgba(180,210,230,0.18),transparent_45%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08),transparent_30%)]",
  vlog:
    "from-[#3a1824] via-[#1a1018] to-[#07090f] [background-image:radial-gradient(circle_at_60%_40%,rgba(255,107,74,0.28),transparent_40%),radial-gradient(circle_at_20%_20%,rgba(255,214,102,0.12),transparent_35%)]",
};

type Phase = "idle" | "scanning" | "ready";

export function IdentifyDemo() {
  const [selectedId, setSelectedId] = useState(DEMO_MOMENTS[0].id);
  const [phase, setPhase] = useState<Phase>("idle");
  const [resultMoment, setResultMoment] = useState<DemoMoment | null>(null);
  const [isPending, startTransition] = useTransition();

  const selected = useMemo(
    () => DEMO_MOMENTS.find((m) => m.id === selectedId) ?? DEMO_MOMENTS[0],
    [selectedId],
  );

  function selectMoment(id: string) {
    setSelectedId(id);
    setPhase("idle");
    setResultMoment(null);
  }

  function runIdentify() {
    setPhase("scanning");
    setResultMoment(null);
    window.setTimeout(() => {
      startTransition(() => {
        setResultMoment(selected);
        setPhase("ready");
      });
    }, 1600);
  }

  return (
    <section id="demo" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">
          Trial · NMIXX Bae only
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          フレームを選ぶだけで、特定が始まる
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--ink-muted)]">
          まずはUIの感触を確かめるためのデモ。解析本体はまだつながっていません。
          モーメントを選び、「特定する」を押すと候補カードが立ち上がります。
        </p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {DEMO_MOMENTS.map((moment) => {
          const active = moment.id === selectedId;
          return (
            <button
              key={moment.id}
              type="button"
              onClick={() => selectMoment(moment.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-[var(--accent)] bg-[rgba(61,224,196,0.08)]"
                  : "border-[var(--line)] bg-[rgba(16,20,31,0.65)] hover:border-[rgba(61,224,196,0.35)]"
              }`}
            >
              <p className="text-xs text-[var(--ink-muted)]">
                {moment.sourceLabel}
              </p>
              <p className="font-display mt-2 text-lg font-semibold">
                {moment.title}
              </p>
              <p className="mt-1 text-sm text-[var(--accent)]">
                @{moment.timestamp} · {moment.focusCategory}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--bg-panel)]">
          <div
            className={`relative aspect-[16/10] bg-gradient-to-br ${TONE_CLASS[selected.frameTone]}`}
          >
            <div className="grain" />
            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
              <div className="flex items-center justify-between text-xs tracking-[0.18em] text-white/70">
                <span>REC FRAME</span>
                <span>{selected.timestamp}</span>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold sm:text-3xl">
                  NMIXX Bae
                </p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75">
                  {selected.sceneNote}
                </p>
              </div>
            </div>

            {(phase === "scanning" || isPending) && (
              <>
                <div className="absolute inset-0 bg-[rgba(7,9,15,0.35)]" />
                <div className="animate-scan absolute inset-x-8 h-16 bg-gradient-to-b from-transparent via-[rgba(61,224,196,0.35)] to-transparent" />
                <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent)]">
                  <div className="animate-pulse-ring absolute inset-0 rounded-full border border-[var(--accent)]" />
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-[var(--line)] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[var(--ink-muted)]">
                注目カテゴリ:{" "}
                <span className="text-[var(--ink)]">{selected.focusCategory}</span>
              </p>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">
                モック解析 · 実動画パイプラインは未接続
              </p>
            </div>
            <button
              type="button"
              onClick={runIdentify}
              disabled={phase === "scanning"}
              className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[#04110e] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
            >
              {phase === "scanning" ? "フレームを精査中…" : "このフレームを特定する"}
            </button>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(16,20,31,0.55)] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-muted)]">
            Agent output preview
          </p>
          {phase === "idle" && (
            <p className="mt-6 leading-relaxed text-[var(--ink-muted)]">
              まだ結果はありません。左のフレームで「特定する」を押すと、確証度つきの候補がここに並びます。
            </p>
          )}
          {phase === "scanning" && (
            <p className="mt-6 text-[var(--accent)]">
              物体切出し → 特徴言語化 → EC横断照合をシミュレートしています…
            </p>
          )}
          {phase === "ready" && resultMoment && (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-[var(--ink-muted)]">
                {resultMoment.items.length}件の候補 · フォーカスは
                {resultMoment.focusCategory}
              </p>
              {resultMoment.items.map((item, index) => (
                <ItemCard key={item.id} item={item} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
