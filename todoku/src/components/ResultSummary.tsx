import { formatMinutes, formatYen } from "@/lib/constants";
import type { RankedMatches } from "@/lib/types";

export function ResultSummary({ totals }: { totals: RankedMatches["totals"] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <Stat label="届きそうな制度" value={`${totals.count}件`} />
      <Stat label="探す時間の削減目安" value={formatMinutes(totals.timeSavedMinutes)} />
      <Stat
        label="手取りに効く金額目安"
        value={totals.annualYenHint > 0 ? `年${formatYen(totals.annualYenHint)}` : "相談・手続中心"}
      />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-teal/10 bg-paper px-4 py-4 shadow-sm">
      <p className="text-xs text-teal/70">{label}</p>
      <p className="mt-1 text-xl font-bold text-teal">{value}</p>
    </div>
  );
}
