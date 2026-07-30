export type Category = "job_hunting" | "career_change";

export type DisplayMode = "keypoints" | "full";

export type CompletionStatus = "empty" | "keypoints_only" | "complete";

export interface ScriptItem {
  id: string;
  question: string;
  keyPoints: string;
  fullText: string;
  targetSeconds: number;
  order: number;
}

export interface ScriptSet {
  id: string;
  name: string;
  category: Category;
  items: ScriptItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AppData {
  version: 1;
  sets: ScriptSet[];
}

export interface TemplateQuestion {
  question: string;
  targetSeconds: number;
}

export interface Template {
  category: Category;
  name: string;
  questions: TemplateQuestion[];
}
