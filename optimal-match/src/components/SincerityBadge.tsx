import type { SincerityType } from "@/lib/sincerity";
import { getSincerityLabel, getSincerityDescription } from "@/lib/sincerity";

const STYLES: Record<SincerityType, { bg: string; text: string; icon: string }> = {
  playful: { bg: "bg-sky-100", text: "text-sky-800", icon: "🎉" },
  balanced: { bg: "bg-violet-100", text: "text-violet-800", icon: "⚖️" },
  sincere: { bg: "bg-teal-100", text: "text-teal-800", icon: "🤝" },
};

export function SincerityBadge({
  score,
  size = "sm",
}: {
  score: number;
  size?: "sm" | "md";
}) {
  const label = getSincerityLabel(score);
  const desc = getSincerityDescription(score);
  const type = score <= 2 ? "playful" : score >= 4 ? "sincere" : "balanced";
  const style = STYLES[type as SincerityType];

  return (
    <span
      title={desc}
      className={`inline-flex items-center gap-1 rounded-full ${style.bg} ${style.text} ${
        size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs"
      } font-medium`}
    >
      <span>{style.icon}</span>
      {label}
    </span>
  );
}

export function SincerityMismatchWarning({
  gap,
  myLabel,
  otherLabel,
}: {
  gap: number;
  myLabel: string;
  otherLabel: string;
}) {
  if (gap < 3) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p className="font-bold">スタイル差に注意</p>
      <p className="mt-1">
        あなたは<strong>{myLabel}</strong>、相手は<strong>{otherLabel}</strong>。
        期待する関係性が異なる可能性があります。
      </p>
    </div>
  );
}
