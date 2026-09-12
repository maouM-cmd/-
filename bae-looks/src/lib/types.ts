export type ConfidenceLevel = "exact" | "same_brand" | "similar";

export type ItemCategory =
  | "トップス"
  | "アウター"
  | "ボトムス"
  | "シューズ"
  | "ネックレス"
  | "ピアス"
  | "バッグ"
  | "リップ";

export interface ShopLink {
  label: string;
  href: string;
  kind: "official" | "mall" | "similar";
}

export interface IdentifiedItem {
  id: string;
  category: ItemCategory;
  brandName: string;
  productName: string;
  modelCandidate: string;
  primaryColor: string;
  materialsTexture: string;
  distinctiveMarks: string;
  confidence: ConfidenceLevel;
  confidenceNote: string;
  priceHint: string;
  links: ShopLink[];
  alternatives: Array<{
    label: string;
    priceHint: string;
    note: string;
  }>;
}

export interface DemoMoment {
  id: string;
  title: string;
  sourceLabel: string;
  timestamp: string;
  sceneNote: string;
  frameTone: "stage" | "airport" | "vlog";
  focusCategory: ItemCategory;
  items: IdentifiedItem[];
}
