export type Category =
  | "payment"
  | "ec"
  | "finance"
  | "subscription"
  | "point"
  | "sidejob"
  | "other";

export type SortOption = "new" | "popular" | "referrer" | "referee";

export interface Deal {
  id: number;
  service_name: string;
  referrer_reward: string;
  referee_reward: string;
  referrer_reward_value: number | null;
  referee_reward_value: number | null;
  referral_link: string | null;
  referral_code: string | null;
  conditions: string;
  description: string;
  category: Category;
  expires_at: string | null;
  author_name: string;
  helpful_count: number;
  created_at: string;
}

export interface CreateDealInput {
  service_name: string;
  referrer_reward: string;
  referee_reward: string;
  referrer_reward_value?: number;
  referee_reward_value?: number;
  referral_link?: string;
  referral_code?: string;
  conditions?: string;
  description?: string;
  category: Category;
  expires_at?: string;
  author_name: string;
}
