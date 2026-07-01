export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "プロンプ道場";
export const SITE_TAGLINE = "プロンプトを書いて、評価されよう";

export const SESSION_COOKIE = "prompt_dojo_session";

export const RANK_COLORS: Record<string, string> = {
  S: "text-amber-500",
  A: "text-emerald-600",
  B: "text-blue-600",
  C: "text-gray-500",
};

export const RANK_BG: Record<string, string> = {
  S: "bg-amber-100 text-amber-800",
  A: "bg-emerald-100 text-emerald-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-gray-100 text-gray-700",
};

export function computeTotalScore(
  autoScore: number,
  communityScore: number | null,
): number {
  if (communityScore === null) return autoScore;
  return Math.round(autoScore * 0.4 + communityScore * 20 * 0.6);
}

export function scoreToRank(score: number): "S" | "A" | "B" | "C" {
  if (score >= 85) return "S";
  if (score >= 70) return "A";
  if (score >= 50) return "B";
  return "C";
}
