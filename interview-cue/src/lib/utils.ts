import type { CompletionStatus, ScriptItem } from "@/lib/types";

export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getCompletionStatus(item: ScriptItem): CompletionStatus {
  const hasKeyPoints = item.keyPoints.trim().length > 0;
  const hasFullText = item.fullText.trim().length > 0;

  if (hasKeyPoints && hasFullText) return "complete";
  if (hasKeyPoints) return "keypoints_only";
  return "empty";
}

export function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const CATEGORY_LABELS = {
  job_hunting: "就活",
  career_change: "転職",
} as const;

export const COMPLETION_LABELS: Record<CompletionStatus, string> = {
  empty: "未入力",
  keypoints_only: "要点のみ",
  complete: "完成",
};

export const COMPLETION_COLORS: Record<CompletionStatus, string> = {
  empty: "bg-zinc-100 text-zinc-600",
  keypoints_only: "bg-amber-100 text-amber-800",
  complete: "bg-emerald-100 text-emerald-800",
};
