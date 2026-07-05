export const SITE_NAME = "最適人探し";
export const SITE_TAGLINE = "相性スコアで、あなたに最適な人を見つける";

export const LOOKING_FOR_OPTIONS = [
  { value: "friendship", label: "友達" },
  { value: "dating", label: "恋愛" },
  { value: "business", label: "ビジネスパートナー" },
  { value: "mentor", label: "メンター" },
] as const;

export const INTEREST_TAGS = [
  "旅行", "料理", "映画", "音楽", "スポーツ", "読書", "ゲーム",
  "アート", "テクノロジー", "起業", "ヨガ", "カフェ", "写真", "ペット",
] as const;
