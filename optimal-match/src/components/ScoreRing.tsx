import type { MatchBreakdown } from "@/lib/types";

export function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-gray-500";
  return (
    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow ring-2 ring-rose-100 ${color}`}>
      <span className="text-lg font-bold">{score}%</span>
    </div>
  );
}

export function BreakdownBars({ breakdown }: { breakdown: MatchBreakdown }) {
  const items = [
    { label: "興味", value: breakdown.interestScore },
    { label: "目的", value: breakdown.goalScore },
    { label: "価値観", value: breakdown.valuesScore },
  ];
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-0.5 flex justify-between text-xs text-gray-500">
            <span>{item.label}</span>
            <span>{item.value}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-rose-50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500"
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
