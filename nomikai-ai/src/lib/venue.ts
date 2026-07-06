import { BUDGET_OPTIONS, MOOD_OPTIONS, VENUE_TYPES } from "./constants";
import type { Mood, VenueCandidate } from "./types";

function budgetLabel(budget: number): string {
  const opt = BUDGET_OPTIONS.find((b) => b.value === budget);
  return opt?.label ?? `〜${budget.toLocaleString()}円`;
}

function moodLabel(mood: Mood): string {
  const opt = MOOD_OPTIONS.find((m) => m.value === mood);
  return opt ? `${opt.emoji} ${opt.label}` : mood;
}

function venueSuffix(mood: Mood, index: number): string {
  const names: Record<Mood, string[]> = {
    casual: ["のんびり亭", "駅前横丁", "くつろぎ処"],
    lively: ["大盛り上がり", "宴", "ワイワイ酒場"],
    quiet: ["隠れ家", "大人の空間", "静かな角"],
    celebration: ["特別席", "乾杯処", "祝福の間"],
  };
  return names[mood][index % names[mood].length];
}

export function generateVenueCandidates(
  middleStation: string,
  budget: number,
  mood: Mood
): VenueCandidate[] {
  const stationBase = middleStation.replace(/駅$/, "");
  const bLabel = budgetLabel(budget);
  const mLabel = moodLabel(mood);

  return VENUE_TYPES.slice(0, 3).map((type, i) => {
    const name = `${stationBase}${venueSuffix(mood, i)} ${type}`;
    const query = encodeURIComponent(`${stationBase} ${type}`);
    return {
      name,
      type,
      budgetLabel: bLabel,
      moodLabel: mLabel,
      description: `${middleStation}周辺の${type}。${mLabel}な雰囲気で、予算${bLabel}目安。`,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${query}`,
    };
  });
}
