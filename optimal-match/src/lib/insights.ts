import type { LookingFor, MatchBreakdown, Profile } from "./types";

export type MatchTier = "optimal" | "good" | "explore";

export interface CompetitorRow {
  feature: string;
  swipeApps: string;
  optimalMatch: string;
  advantage: boolean;
}

export const COMPETITIVE_PILLARS = [
  {
    id: "explainable",
    title: "説明可能マッチング",
    subtitle: "なぜ相性が良いか、数字と理由で見える",
    vs: "スワイプ型はアルゴリズムがブラックボックス",
  },
  {
    id: "optimal-first",
    title: "最適順ランキング",
    subtitle: "運任せのスワイプではなく、スコア上位から会う",
    vs: "無限スワイプで疲弊しやすい",
  },
  {
    id: "multi-purpose",
    title: "4目的を1アプリで",
    subtitle: "恋愛・友達・ビジネス・メンターを切替",
    vs: "恋愛専用アプリが大半",
  },
  {
    id: "icebreakers",
    title: "会話きっかけ自動生成",
    subtitle: "共通点から最初の一言を提案",
    vs: "マッチ後に何を話すか悩む",
  },
] as const;

export const COMPETITOR_TABLE: CompetitorRow[] = [
  { feature: "相性の理由が見える", swipeApps: "×", optimalMatch: "◎ 3軸内訳", advantage: true },
  { feature: "最適順ランキング", swipeApps: "× ランダム表示", optimalMatch: "◎ スコア順", advantage: true },
  { feature: "恋愛以外の目的", swipeApps: "△ 恋愛中心", optimalMatch: "◎ 4種類", advantage: true },
  { feature: "会話のきっかけ提案", swipeApps: "×", optimalMatch: "◎ 自動生成", advantage: true },
  { feature: "価値観ベース", swipeApps: "△ プロフィール文のみ", optimalMatch: "◎ 4軸スライダー", advantage: true },
  { feature: "写真スワイプ", swipeApps: "◎", optimalMatch: "△ MVPでは未対応", advantage: false },
];

export function getMatchTier(totalScore: number): { tier: MatchTier; label: string; color: string } {
  if (totalScore >= 75) return { tier: "optimal", label: "最適マッチ", color: "bg-emerald-500" };
  if (totalScore >= 55) return { tier: "good", label: "好相性", color: "bg-amber-500" };
  return { tier: "explore", label: "チャレンジ", color: "bg-slate-400" };
}

const GOAL_LABELS: Record<LookingFor, string> = {
  friendship: "友達",
  dating: "恋愛",
  business: "ビジネス",
  mentor: "メンター",
};

export function generateConversationStarters(
  me: Profile,
  other: Profile,
  breakdown: MatchBreakdown
): string[] {
  const starters: string[] = [];
  const shared = me.interests.filter((i) => other.interests.includes(i));

  if (shared.length > 0) {
    starters.push(`「${shared[0]}」好きなんですね！おすすめありますか？`);
    if (shared.length > 1) {
      starters.push(`${shared.slice(0, 2).join("と")}、両方共通ですね。最近ハマってることありますか？`);
    }
  }

  if (breakdown.goalScore >= 100) {
    starters.push(
      `${GOAL_LABELS[other.looking_for]}の仲間を探してるんですね。どんな関係を理想にしてますか？`
    );
  }

  if (breakdown.valuesScore >= 75) {
    starters.push("価値観が近いみたいですね。休日の過ごし方とか教えてもらえますか？");
  }

  if (other.bio.length > 10) {
    const snippet = other.bio.slice(0, 20);
    starters.push(`プロフィールの「${snippet}…」の部分、すごく共感しました。`);
  }

  if (starters.length === 0) {
    starters.push(`はじめまして！${other.name}さんのプロフィール拝見しました。よかったらお話しませんか？`);
  }

  return [...new Set(starters)].slice(0, 3);
}

export function buildAdvantageSummary(
  me: Profile,
  other: Profile,
  breakdown: MatchBreakdown
): string {
  const shared = me.interests.filter((i) => other.interests.includes(i));
  if (breakdown.totalScore >= 75 && shared.length >= 2) {
    return `共通の${shared.length}つの興味と一致した目的 — 競合アプリでは見えない「根拠つき」マッチ`;
  }
  if (breakdown.valuesScore >= 80) {
    return "価値観の近さが突出 — 長期的な関係に強い相性";
  }
  if (breakdown.goalScore >= 100) {
    return "目的が完全一致 — 無駄なスワイプを省ける";
  }
  return "3軸スコアで可視化 — なぜこの人かが一目でわかる";
}

export function enrichBreakdown(
  me: Profile,
  other: Profile,
  base: MatchBreakdown
): MatchBreakdown {
  const tierInfo = getMatchTier(base.totalScore);
  return {
    ...base,
    tier: tierInfo.tier,
    tierLabel: tierInfo.label,
    conversationStarters: generateConversationStarters(me, other, base),
    advantageSummary: buildAdvantageSummary(me, other, base),
  };
}
