export type ChallengeStatus = "active" | "archived";

export type LeaderboardType = "total" | "auto" | "community";

export type PromptRank = "S" | "A" | "B" | "C";

export interface PromptCheck {
  label: string;
  passed: boolean;
  tip: string;
  points: number;
  maxPoints: number;
}

export interface EvaluationResult {
  score: number;
  rank: PromptRank;
  checks: PromptCheck[];
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  sample_output: string;
  status: ChallengeStatus;
  created_at: string;
  submission_count?: number;
}

export interface User {
  id: number;
  display_name: string;
  session_token: string;
  created_at: string;
}

export interface Submission {
  id: number;
  challenge_id: number;
  user_id: number;
  prompt_text: string;
  auto_score: number;
  auto_feedback_json: string;
  community_score: number | null;
  rating_count: number;
  created_at: string;
  author_name?: string;
  challenge_title?: string;
  user_rating?: number | null;
  total_score?: number;
}

export interface Rating {
  id: number;
  submission_id: number;
  user_id: number;
  stars: number;
  created_at: string;
}

export interface CreateChallengeInput {
  title: string;
  description: string;
  sample_output?: string;
  status?: ChallengeStatus;
}

export interface LeaderboardEntry {
  submission_id: number;
  challenge_id: number;
  challenge_title: string;
  author_name: string;
  auto_score: number;
  community_score: number | null;
  rating_count: number;
  total_score: number;
  rank: PromptRank;
  created_at: string;
}
