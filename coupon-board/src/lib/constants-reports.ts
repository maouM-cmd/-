import type { ReportReason } from "./types";

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: "expired", label: "期限切れ・終了済み" },
  { value: "false_info", label: "虚偽・誤った情報" },
  { value: "scam", label: "詐欺・違法の疑い" },
  { value: "spam", label: "スパム・重複" },
  { value: "other", label: "その他" },
];

export const REPORT_HIDE_THRESHOLD = 3;
