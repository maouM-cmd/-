export type Category =
  | "ec"
  | "food"
  | "beauty"
  | "service"
  | "subscription"
  | "other";

export interface Coupon {
  id: number;
  service_name: string;
  title: string;
  description: string;
  coupon_code: string | null;
  discount: string;
  url: string;
  category: Category;
  expires_at: string | null;
  author_name: string;
  helpful_count: number;
  created_at: string;
}

export interface CreateCouponInput {
  service_name: string;
  title: string;
  description: string;
  coupon_code?: string;
  discount: string;
  url: string;
  category: Category;
  expires_at?: string;
  author_name: string;
}
