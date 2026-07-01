export type ChallengeStatus = "pending" | "active" | "archived";

export type LeaderboardType = "total" | "auto" | "community" | "llm";

export type PromptRank = "S" | "A" | "B" | "C";

export type ReportReason = "inappropriate" | "spam" | "off_topic" | "other";

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

export interface LLMEvaluationResult {
  score: number;
  feedback: string;
  improvements: string[];
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  sample_output: string;
  status: ChallengeStatus;
  author_id: number | null;
  created_at: string;
  submission_count?: number;
  author_name?: string;
}

export interface User {
  id: number;
  display_name: string;
  session_token: string;
  oauth_provider: string | null;
  oauth_id: string | null;
  created_at: string;
}

export interface Submission {
  id: number;
  challenge_id: number;
  user_id: number;
  prompt_text: string;
  auto_score: number;
  auto_feedback_json: string;
  llm_score: number | null;
  llm_feedback_json: string | null;
  community_score: number | null;
  rating_count: number;
  report_count: number;
  is_hidden: number;
  created_at: string;
  author_name?: string;
  challenge_title?: string;
  user_rating?: number | null;
  total_score?: number;
  rank?: PromptRank;
}

export interface Comment {
  id: number;
  submission_id: number;
  user_id: number;
  body: string;
  created_at: string;
  author_name?: string;
}

export interface Report {
  id: number;
  submission_id: number;
  user_id: number;
  reason: ReportReason;
  detail: string;
  created_at: string;
  author_name?: string;
  submission_preview?: string;
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
  author_id?: number | null;
}

export interface LeaderboardEntry {
  submission_id: number;
  challenge_id: number;
  challenge_title: string;
  author_name: string;
  auto_score: number;
  llm_score: number | null;
  community_score: number | null;
  rating_count: number;
  total_score: number;
  rank: PromptRank;
  created_at: string;
}

export interface AdminSubmission extends Submission {
  comment_count: number;
}
