import type { ReportReason } from "./types";

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: "inappropriate", label: "不適切な内容" },
  { value: "spam", label: "スパム" },
  { value: "off_topic", label: "課題と無関係" },
  { value: "other", label: "その他" },
];

export const REPORT_HIDE_THRESHOLD = 3;
