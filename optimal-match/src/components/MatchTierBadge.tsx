import type { MatchBreakdown } from "@/lib/types";
import { getMatchTier } from "@/lib/insights";

const TIER_COLORS = {
  optimal: "bg-emerald-500",
  good: "bg-amber-500",
  explore: "bg-slate-400",
} as const;

export function MatchTierBadge({ breakdown }: { breakdown: MatchBreakdown }) {
  const tier = breakdown.tier ?? getMatchTier(breakdown.totalScore).tier;
  const label = breakdown.tierLabel ?? getMatchTier(breakdown.totalScore).label;

  return (
    <span className={`inline-flex items-center rounded-full ${TIER_COLORS[tier]} px-2.5 py-0.5 text-xs font-bold text-white`}>
      {label}
    </span>
  );
}
