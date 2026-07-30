export type ProductCategory =
  | "base"
  | "lip"
  | "eye"
  | "skincare"
  | "fragrance"
  | "other";

export type SkinType = "dry" | "oily" | "combination" | "sensitive" | "normal";

export type IngredientTagId =
  | "alcohol_free"
  | "paraben_free"
  | "fragrance_free"
  | "sensitive_ok"
  | "vegan"
  | "spf"
  | "caution_alcohol"
  | "caution_fragrance";

export interface Product {
  id: number;
  brand: string;
  name: string;
  shade: string;
  category: ProductCategory;
  key_ingredients: string[];
  ingredient_tags: IngredientTagId[];
  skin_types: SkinType[];
  avoid_for: string;
  talking_points: string;
  notes: string;
  is_pinned: boolean;
  study_progress: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductInput {
  brand: string;
  name: string;
  shade?: string;
  category: ProductCategory;
  key_ingredients?: string[];
  ingredient_tags?: IngredientTagId[];
  skin_types?: SkinType[];
  avoid_for?: string;
  talking_points?: string;
  notes?: string;
  is_pinned?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  study_progress?: number;
}

export interface IngredientFaq {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
}

export interface StudyLog {
  id: number;
  product_id: number;
  studied_at: string;
  score: number;
}

export interface ShiftLog {
  id: number;
  product_id: number | null;
  learned_note: string;
  struggled_ingredient: string;
  created_at: string;
}

export interface CreateShiftLogInput {
  product_id?: number | null;
  learned_note?: string;
  struggled_ingredient?: string;
}

export interface AppSettings {
  staff_name: string;
  shop_name: string;
  pin_limit: number;
  cheer_message: string;
  welcome_seen: boolean;
}

export interface StudySessionResult {
  product_id: number;
  remembered: boolean;
}
