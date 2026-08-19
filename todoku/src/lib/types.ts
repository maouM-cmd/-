export type HouseholdType = "single" | "couple" | "single_parent" | "other";
export type IncomeBand = "low" | "middle" | "high";
export type Employment = "employed" | "unemployed" | "self_employed" | "student";
export type Housing = "rent" | "own" | "looking";
export type Area = "23ku" | "tama" | "island";
export type BenefitCategory =
  | "childcare"
  | "medical"
  | "housing"
  | "eldercare"
  | "education"
  | "livelihood";

export interface Child {
  age: number;
}

export interface Household {
  householdType: HouseholdType;
  children: Child[];
  caregiving: boolean;
  incomeBand: IncomeBand;
  employment: Employment;
  housing: Housing;
  disability: boolean;
  area: Area;
}

export interface BenefitRules {
  requireChildren?: boolean;
  childAgeMin?: number;
  childAgeMax?: number;
  householdTypes?: HouseholdType[];
  incomeBands?: IncomeBand[];
  requireCaregiving?: boolean;
  requireDisability?: boolean;
  requireHousingNeed?: boolean;
}

export interface Benefit {
  id: string;
  name: string;
  agency: string;
  category: BenefitCategory;
  summary: string;
  amountHint: string;
  timeSavedMinutes: number;
  annualYenHint: number;
  procedureUrl: string;
  procedureSteps: string[];
  source: { name: string; url: string };
  rules: BenefitRules;
}

export interface Persona {
  id: string;
  name: string;
  title: string;
  blurb: string;
  household: Household;
}

export interface MatchResult {
  benefit: Benefit;
  eligible: boolean;
  score: number;
  reasons: string[];
  gaps: string[];
}

export interface RankedMatches {
  eligible: MatchResult[];
  nearby: MatchResult[];
  totals: {
    count: number;
    timeSavedMinutes: number;
    annualYenHint: number;
  };
}
