import type { ConfidenceLevel } from "@/lib/types";

const LABELS: Record<
  ConfidenceLevel,
  { ja: string; tone: string; hint: string }
> = {
  exact: {
    ja: "完全一致",
    tone: "bg-[rgba(61,224,196,0.18)] text-[#3de0c4] border-[rgba(61,224,196,0.4)]",
    hint: "複数手がかりが一致",
  },
  same_brand: {
    ja: "同一ブランド",
    tone: "bg-[rgba(255,214,102,0.14)] text-[#ffd666] border-[rgba(255,214,102,0.35)]",
    hint: "ブランドまでは有力",
  },
  similar: {
    ja: "類似デザイン",
    tone: "bg-[rgba(255,107,74,0.14)] text-[#ff8f74] border-[rgba(255,107,74,0.35)]",
    hint: "シルエット近似",
  },
};

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const meta = LABELS[level];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-semibold tracking-wide ${meta.tone}`}
      title={meta.hint}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {meta.ja}
    </span>
  );
}
