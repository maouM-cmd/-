import type {
  Benefit,
  Household,
  HouseholdType,
  IncomeBand,
  MatchResult,
  RankedMatches,
} from "./types";

const TYPE_LABEL: Record<HouseholdType, string> = {
  single: "単身",
  couple: "夫婦・パートナー",
  single_parent: "ひとり親",
  other: "その他の世帯",
};

const INCOME_LABEL: Record<IncomeBand, string> = {
  low: "家計に余裕が少ない",
  middle: "ふつうの家計",
  high: "比較的余裕がある",
};

function childAges(household: Household): number[] {
  return household.children.map((c) => c.age);
}

function hasChildInRange(household: Household, min?: number, max?: number): boolean {
  return household.children.some(
    (c) => (min == null || c.age >= min) && (max == null || c.age <= max)
  );
}

function formatAges(household: Household): string {
  return childAges(household)
    .map((age) => `${age}歳`)
    .join("・");
}

export function matchBenefit(household: Household, benefit: Benefit): MatchResult {
  const reasons: string[] = [];
  const gaps: string[] = [];
  let hardFail = false;
  let points = 0;
  let maxPoints = 0;
  const rules = benefit.rules;

  if (rules.requireChildren) {
    maxPoints += 30;
    if (household.children.length === 0) {
      hardFail = true;
      gaps.push("対象となる子どもがいない");
    } else {
      points += 30;
      reasons.push(`お子さん（${formatAges(household)}）がいる`);
    }
  }

  if (rules.childAgeMin != null || rules.childAgeMax != null) {
    maxPoints += 20;
    const min = rules.childAgeMin ?? 0;
    const max = rules.childAgeMax ?? 18;
    if (hasChildInRange(household, rules.childAgeMin, rules.childAgeMax)) {
      points += 20;
      reasons.push(`${min}〜${max}歳の子どもが対象年齢`);
    } else {
      hardFail = true;
      gaps.push(`対象年齢は${min}〜${max}歳`);
    }
  }

  if (rules.householdTypes?.length) {
    maxPoints += 20;
    if (rules.householdTypes.includes(household.householdType)) {
      points += 20;
      reasons.push(`世帯の形「${TYPE_LABEL[household.householdType]}」が条件に合う`);
    } else {
      hardFail = true;
      gaps.push("世帯の形が対象外");
    }
  }

  if (rules.incomeBands?.length) {
    maxPoints += 15;
    if (rules.incomeBands.includes(household.incomeBand)) {
      points += 15;
      reasons.push(`${INCOME_LABEL[household.incomeBand]}世帯向けの目安に入る`);
    } else if (household.incomeBand === "high" && !rules.incomeBands.includes("high")) {
      hardFail = true;
      gaps.push("所得制限の目安を超えている可能性");
    } else {
      points += 4;
      gaps.push("所得要件は区市町村の判定が必要");
    }
  }

  if (rules.requireCaregiving) {
    maxPoints += 25;
    if (household.caregiving) {
      points += 25;
      reasons.push("家族の介護・世話をしている");
    } else {
      hardFail = true;
      gaps.push("介護している家族が条件");
    }
  }

  if (rules.requireDisability) {
    maxPoints += 20;
    if (household.disability) {
      points += 20;
      reasons.push("障害・難病などの状況が対象");
    } else {
      hardFail = true;
      gaps.push("障害者手帳等の要件あり");
    }
  }

  if (rules.requireHousingNeed) {
    maxPoints += 15;
    if (household.housing === "looking" || household.housing === "rent") {
      points += 15;
      reasons.push("住まいの支援が役立つ状況");
    } else {
      hardFail = true;
      gaps.push("住宅の困りごとが条件");
    }
  }

  if (maxPoints === 0) {
    points = 48;
    maxPoints = 100;
    reasons.push("多くの都民が使える基礎的な案内");
  }

  if (benefit.category === "childcare" && household.children.length > 0 && !rules.requireChildren) {
    points += 8;
    maxPoints += 8;
  }

  if (benefit.category === "eldercare" && household.caregiving && !rules.requireCaregiving) {
    points += 8;
    maxPoints += 8;
  }

  if (household.incomeBand === "low" && benefit.category === "livelihood") {
    points += 6;
    maxPoints += 6;
    reasons.push("家計の負担を直接減らせる");
  }

  const raw = maxPoints === 0 ? 0 : Math.round((points / maxPoints) * 100);
  const score = hardFail ? Math.min(raw, 38) : Math.max(raw, 42);
  const uniqueReasons = [...new Set(reasons)];
  const uniqueGaps = [...new Set(gaps)];

  return {
    benefit,
    eligible: !hardFail,
    score,
    reasons: uniqueReasons,
    gaps: uniqueGaps,
  };
}

export function rankBenefits(household: Household, benefits: Benefit[]): RankedMatches {
  const results = benefits
    .map((benefit) => matchBenefit(household, benefit))
    .sort((a, b) => b.score - a.score);

  const eligible = results.filter((r) => r.eligible);
  const nearby = results.filter((r) => !r.eligible && r.score >= 15);

  return {
    eligible,
    nearby,
    totals: {
      count: eligible.length,
      timeSavedMinutes: eligible.reduce((sum, r) => sum + r.benefit.timeSavedMinutes, 0),
      annualYenHint: eligible.reduce((sum, r) => sum + r.benefit.annualYenHint, 0),
    },
  };
}

export function emptyHousehold(): Household {
  return {
    householdType: "couple",
    children: [],
    caregiving: false,
    incomeBand: "middle",
    employment: "employed",
    housing: "rent",
    disability: false,
    area: "23ku",
  };
}
