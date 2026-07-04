import type { LookingFor } from "./types";

/** 1=遊び寄り 〜 5=誠実寄り */
export type SincerityScore = 1 | 2 | 3 | 4 | 5;

export type SincerityType = "playful" | "balanced" | "sincere";

/** 一覧フィルター */
export type SincerityFilter = "all" | SincerityType | "aligned";

export const SINCERITY_FILTER_OPTIONS: {
  value: SincerityFilter;
  label: string;
  icon: string;
}[] = [
  { value: "all", label: "すべて", icon: "👥" },
  { value: "playful", label: "遊び型", icon: "🎉" },
  { value: "balanced", label: "バランス型", icon: "⚖️" },
  { value: "sincere", label: "誠実型", icon: "🤝" },
  { value: "aligned", label: "スタイル一致", icon: "✓" },
];

export function matchesSincerityFilter(
  sincerity: number,
  aligned: boolean | undefined,
  filter: SincerityFilter
): boolean {
  if (filter === "all") return true;
  if (filter === "aligned") return aligned === true;
  return getSincerityType(sincerity) === filter;
}

export function filterMatchesBySincerity<
  T extends { profile: { sincerity: number }; breakdown: { sincerityAligned?: boolean } },
>(matches: T[], filter: SincerityFilter): T[] {
  return matches.filter((m) =>
    matchesSincerityFilter(m.profile.sincerity, m.breakdown.sincerityAligned, filter)
  );
}

export function clampSincerity(n: number): SincerityScore {
  return Math.min(5, Math.max(1, Math.round(n))) as SincerityScore;
}

export function getSincerityType(score: number): SincerityType {
  if (score <= 2) return "playful";
  if (score >= 4) return "sincere";
  return "balanced";
}

export function getSincerityLabel(score: number): string {
  const type = getSincerityType(score);
  if (type === "playful") return "遊び型";
  if (type === "sincere") return "誠実型";
  return "バランス型";
}

export function getSincerityDescription(score: number): string {
  const type = getSincerityType(score);
  if (type === "playful") return "気軽な出会い・楽しさ重視";
  if (type === "sincere") return "真剣な関係・誠実さ重視";
  return "状況に応じて柔軟に";
}

export function computeSincerityCompatibility(
  mine: number,
  theirs: number,
  lookingFor: LookingFor
): { score: number; gap: number; aligned: boolean } {
  const gap = Math.abs(mine - theirs);
  const strict = lookingFor === "dating" || lookingFor === "friendship";
  const maxGap = strict ? 4 : 3;
  const score = 1 - gap / maxGap;
  return { score: Math.max(0, score), gap, aligned: gap <= 1 };
}

export function sincerityMatchReason(
  mine: number,
  theirs: number,
  aligned: boolean,
  gap: number
): string | null {
  const myLabel = getSincerityLabel(mine);
  const theirLabel = getSincerityLabel(theirs);

  if (aligned) {
    return `誠実さスタイルが一致（あなた: ${myLabel} ↔ 相手: ${theirLabel}）`;
  }
  if (gap >= 3) {
    return `⚠ スタイル差あり（${myLabel} ↔ ${theirLabel}）— 期待値のすり合わせ推奨`;
  }
  return `スタイルはやや異なる（${myLabel} ↔ ${theirLabel}）`;
}
