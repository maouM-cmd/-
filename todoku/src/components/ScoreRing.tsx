export function ScoreRing({ score, eligible }: { score: number; eligible: boolean }) {
  const color = !eligible
    ? "text-teal/40"
    : score >= 80
      ? "text-moss"
      : score >= 60
        ? "text-teal"
        : "text-stamp";
  return (
    <div
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow ring-2 ${
        eligible ? "ring-stamp/20" : "ring-teal/10"
      } ${color}`}
    >
      <span className="text-lg font-bold tabular-nums">{score}</span>
    </div>
  );
}
