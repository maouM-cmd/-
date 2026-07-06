import type { PlanMeta } from "@/lib/types";

const BOOST_LABELS: Record<PlanMeta["boost_source"], string> = {
  llm: "OpenAI",
  anthropic: "Claude",
  template: "テンプレート",
};

export function SourceBadge({ meta }: { meta?: PlanMeta }) {
  if (!meta) return null;

  const venuesLabel = meta.venues_source === "places" ? "Google Places" : "テンプレート";
  const boostLabel = BOOST_LABELS[meta.boost_source];

  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
        店舗: {venuesLabel}
      </span>
      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
        盛り上げ: {boostLabel}
      </span>
    </div>
  );
}
