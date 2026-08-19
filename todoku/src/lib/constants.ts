import type { BenefitCategory } from "./types";

export const SITE_NAME = "とどく";
export const SITE_TAGLINE = "探すな、届け。";

export const CATEGORY_LABEL: Record<BenefitCategory, string> = {
  childcare: "子育て",
  medical: "医療",
  housing: "住まい",
  eldercare: "介護",
  education: "学び",
  livelihood: "暮らし",
};

export function formatYen(value: number): string {
  if (value >= 10000) {
    const man = Math.round(value / 10000);
    return `約${man.toLocaleString("ja-JP")}万円`;
  }
  return `約${value.toLocaleString("ja-JP")}円`;
}

export function formatMinutes(value: number): string {
  if (value >= 60) {
    const hours = Math.round(value / 60);
    return `約${hours}時間`;
  }
  return `約${value}分`;
}
