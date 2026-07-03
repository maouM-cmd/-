export type LookingFor = "friendship" | "dating" | "business" | "mentor";

export interface Values {
  social: number;
  career: number;
  family: number;
  adventure: number;
}

export interface Profile {
  id: number;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  looking_for: LookingFor;
  values: Values;
  is_me: boolean;
  created_at: string;
}

export interface CreateProfileInput {
  name: string;
  age: number;
  bio: string;
  interests: string[];
  looking_for: LookingFor;
  values: Values;
  is_me?: boolean;
}

export interface MatchBreakdown {
  interestScore: number;
  goalScore: number;
  valuesScore: number;
  totalScore: number;
  reasons: string[];
}

export interface MatchResult {
  profile: Profile;
  breakdown: MatchBreakdown;
}
