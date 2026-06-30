export type Category =
  | "payment"
  | "ec"
  | "finance"
  | "subscription"
  | "point"
  | "sidejob"
  | "other";

export type SortOption = "new" | "popular" | "referrer" | "referee";

export type ReportReason =
  | "expired"
  | "false_info"
  | "scam"
  | "spam"
  | "other";

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
  screenshot_path: string | null;
  helpful_count: number;
  report_count: number;
  is_hidden: number;
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
  screenshot_path?: string;
}

export interface Report {
  id: number;
  deal_id: number;
  reason: ReportReason;
  detail: string;
  created_at: string;
}
