export type CompanyCategory =
  | "foundation_model"
  | "inference"
  | "enterprise"
  | "open_source"
  | "hardware"
  | "research";

export interface AiCompany {
  id: string;
  name: string;
  nameJa: string;
  founded: number;
  headquarters: string;
  website: string;
  categories: CompanyCategory[];
  description: string;
  descriptionJa: string;
  valuationUsdB: number | null;
  employees: number | null;
  revenueUsdM: number | null;
  keyProducts: string[];
  competitors: string[];
  tags: string[];
}

export interface AiModel {
  id: string;
  companyId: string;
  name: string;
  releaseDate: string;
  contextWindowK: number | null;
  inputPricePer1M: number | null;
  outputPricePer1M: number | null;
  openWeights: boolean;
  apiAvailable: boolean;
}

export const GUMROAD_URL =
  process.env.NEXT_PUBLIC_GUMROAD_URL ?? "https://gumroad.com/l/ai-dashboard-kit";

export const GITHUB_FREE_URL =
  process.env.NEXT_PUBLIC_GITHUB_FREE_URL ??
  "https://github.com/maoum-cmd/-/tree/main/ai-dashboard-kit/free";
