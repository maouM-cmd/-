export type ConfidenceLevel = "exact" | "same_brand" | "similar";

export type ContextLayer = "item" | "interest" | "place";

export type ItemCategory =
  | "トップス"
  | "アウター"
  | "ボトムス"
  | "シューズ"
  | "ネックレス"
  | "ピアス"
  | "バッグ"
  | "リップ"
  | "香水";

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
  observedAt?: string;
  sourceLabel?: string;
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

export interface InterestEvent {
  id: string;
  label: string;
  quote: string;
  timestamp: string;
  sourceLabel: string;
  observedAt: string;
  relatedTags: string[];
  actionLabel: string;
  actionHref: string;
}

export interface PlaceEvent {
  id: string;
  name: string;
  area: string;
  visitedAt: string;
  sourceLabel: string;
  timestamp: string;
  sceneNote: string;
  mapQuery: string;
  companionNote?: string;
}
