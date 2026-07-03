import type { LookingFor, MatchBreakdown, Profile, Values } from "./types";
import { enrichBreakdown } from "./insights";

const COMPATIBLE_GOALS: Record<LookingFor, LookingFor[]> = {
  friendship: ["friendship", "dating"],
  dating: ["dating", "friendship"],
  business: ["business", "mentor"],
  mentor: ["mentor", "business"],
};

function jaccard(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const inter = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : inter / union;
}

function valuesCompatibility(a: Values, b: Values, goal: LookingFor): number {
  const keys = Object.keys(a) as (keyof Values)[];
  let sum = 0;
  for (const k of keys) {
    const diff = Math.abs(a[k] - b[k]);
    if (goal === "business" || goal === "mentor") {
      sum += 1 - diff / 4;
    } else {
      sum += 1 - Math.min(diff, 2) / 4;
    }
  }
  return sum / keys.length;
}

export function computeMatch(me: Profile, other: Profile): MatchBreakdown {
  const reasons: string[] = [];

  const interestScore = jaccard(me.interests, other.interests);
  const shared = me.interests.filter((i) => other.interests.includes(i));
  if (shared.length > 0) {
    reasons.push(`共通の興味: ${shared.slice(0, 4).join("・")}`);
  }

  const compatible = COMPATIBLE_GOALS[me.looking_for];
  const goalScore = compatible.includes(other.looking_for) ? 1 : 0.3;
  if (goalScore === 1) {
    reasons.push("目的が一致しています");
  } else {
    reasons.push("目的はやや異なりますが相性は見られます");
  }

  const valuesScore = valuesCompatibility(me.values, other.values, me.looking_for);
  if (valuesScore >= 0.75) {
    reasons.push("価値観・ライフスタイルが近いです");
  }

  const totalScore = Math.round(
    (interestScore * 0.4 + goalScore * 0.3 + valuesScore * 0.3) * 100
  );

  const base = {
    interestScore: Math.round(interestScore * 100),
    goalScore: Math.round(goalScore * 100),
    valuesScore: Math.round(valuesScore * 100),
    totalScore,
    reasons,
  };

  return enrichBreakdown(me, other, base);
}

export function withMatches(me: Profile, others: Profile[]) {
  return others
    .filter((p) => p.id !== me.id)
    .map((profile) => ({
      profile,
      breakdown: computeMatch(me, profile),
    }))
    .sort((a, b) => b.breakdown.totalScore - a.breakdown.totalScore);
}
