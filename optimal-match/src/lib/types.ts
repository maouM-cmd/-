export type LookingFor = "friendship" | "dating" | "business" | "mentor";

export interface Values {
  social: number;
  career: number;
  family: number;
  adventure: number;
}

export interface Profile {
  id: number;
  user_id: number | null;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  looking_for: LookingFor;
  values: Values;
  /** 1=遊び寄り 〜 5=誠実寄り */
  sincerity: number;
  photo_path: string | null;
  /** @deprecated user_id で判定。シードは null */
  is_me: boolean;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  display_name: string;
  created_at: string;
}

export interface CreateProfileInput {
  name: string;
  age: number;
  bio: string;
  interests: string[];
  looking_for: LookingFor;
  values: Values;
  sincerity: number;
  is_me?: boolean;
}

export interface MatchBreakdown {
  interestScore: number;
  goalScore: number;
  valuesScore: number;
  sincerityScore: number;
  totalScore: number;
  reasons: string[];
  mySincerityLabel?: string;
  otherSincerityLabel?: string;
  sincerityAligned?: boolean;
  sincerityGap?: number;
  tier?: "optimal" | "good" | "explore";
  tierLabel?: string;
  conversationStarters?: string[];
  advantageSummary?: string;
}

export interface MatchResult {
  profile: Profile;
  breakdown: MatchBreakdown;
}

export interface LikeRecord {
  id: number;
  from_user_id: number;
  to_profile_id: number;
  created_at: string;
}

export interface MutualMatch {
  profile: Profile;
  breakdown: MatchBreakdown;
  liked_at: string;
  mutual_at: string;
}
