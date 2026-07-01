/**
 * AI企業ダッシュボード — 共通型定義
 * Claude / Cursor でダッシュボードを実装するときのスキーマ契約
 */

export type CompanyCategory =
  | "foundation_model"
  | "inference"
  | "enterprise"
  | "open_source"
  | "hardware"
  | "research";

export type FundingStage =
  | "seed"
  | "series_a"
  | "series_b"
  | "series_c"
  | "series_d"
  | "growth"
  | "ipo"
  | "acquired"
  | "public";

export interface Company {
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

export interface ModelRelease {
  id: string;
  companyId: string;
  name: string;
  releaseDate: string;
  contextWindowK: number | null;
  modalities: ("text" | "image" | "audio" | "video" | "code")[];
  openWeights: boolean;
  apiAvailable: boolean;
  inputPricePer1M: number | null;
  outputPricePer1M: number | null;
  benchmarkScores: {
    name: string;
    score: number;
    maxScore?: number;
  }[];
  notes: string;
}

export interface FundingRound {
  id: string;
  companyId: string;
  date: string;
  stage: FundingStage;
  amountUsdM: number;
  valuationUsdB: number | null;
  leadInvestors: string[];
  notes: string;
}

export interface NewsItem {
  id: string;
  companyId: string;
  date: string;
  title: string;
  titleJa: string;
  category: "product" | "funding" | "partnership" | "regulation" | "research";
  summary: string;
  url: string;
}

export interface DashboardKpis {
  totalCompanies: number;
  totalValuationUsdB: number;
  totalFundingUsdB: number;
  modelsReleasedThisYear: number;
  avgContextWindowK: number;
}

export interface DashboardData {
  companies: Company[];
  models: ModelRelease[];
  fundingRounds: FundingRound[];
  news: NewsItem[];
  kpis: DashboardKpis;
  generatedAt: string;
}
