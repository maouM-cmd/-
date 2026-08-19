"use client";

import { useMemo, useState } from "react";
import { BenefitCard } from "@/components/BenefitCard";
import { Footer, Header } from "@/components/Header";
import { HouseholdForm } from "@/components/HouseholdForm";
import { PersonaPicker } from "@/components/PersonaPicker";
import { ResultSummary } from "@/components/ResultSummary";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { benefits, personas } from "@/lib/data";
import { emptyHousehold, rankBenefits } from "@/lib/match";
import type { Household } from "@/lib/types";

export function TodokuApp() {
  const [personaId, setPersonaId] = useState<string | null>(personas[0]?.id ?? null);
  const [household, setHousehold] = useState<Household>(
    personas[0]?.household ?? emptyHousehold()
  );

  const ranked = useMemo(() => rankBenefits(household, benefits), [household]);

  function selectPersona(id: string) {
    const persona = personas.find((p) => p.id === id);
    if (!persona) return;
    setPersonaId(id);
    setHousehold(persona.household);
  }

  function updateHousehold(next: Household) {
    setPersonaId(null);
    setHousehold(next);
  }

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <section className="mb-8 overflow-hidden rounded-3xl bg-teal px-6 py-8 text-paper shadow-lg shadow-teal/20 sm:px-10">
          <p className="text-sm tracking-wide text-paper/70">制度は、探させるな。</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
            {SITE_NAME}
            <span className="ml-3 text-lg font-medium text-paper/80">{SITE_TAGLINE}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper/85 sm:text-base">
            世帯の状況を3問だけ聞くと、東京都の支援制度オープンデータと突合し、今届く手当・助成・相談先を順位付きで返します。取りこぼしは、手取り時間を削ります。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold text-teal">ペルソナで見る</h2>
          <PersonaPicker personas={personas} selectedId={personaId} onSelect={selectPersona} />
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-sm font-bold text-teal">自分の世帯で見る（3問）</h2>
          <HouseholdForm household={household} onChange={updateHousehold} />
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-sm font-bold text-teal">届く制度</h2>
          <ResultSummary totals={ranked.totals} />
          <div className="grid gap-4">
            {ranked.eligible.map((result) => (
              <BenefitCard key={result.benefit.id} result={result} />
            ))}
          </div>
        </section>

        {ranked.nearby.length > 0 ? (
          <section className="mt-10 space-y-4">
            <h2 className="text-sm font-bold text-teal/70">条件が近い参考</h2>
            <div className="grid gap-4 opacity-90">
              {ranked.nearby.slice(0, 4).map((result) => (
                <BenefitCard key={result.benefit.id} result={result} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
