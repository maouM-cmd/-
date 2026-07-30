import type { CompletionStatus } from "@/lib/types";
import { COMPLETION_COLORS, COMPLETION_LABELS } from "@/lib/utils";

interface StatusBadgeProps {
  status: CompletionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${COMPLETION_COLORS[status]}`}
    >
      {COMPLETION_LABELS[status]}
    </span>
  );
}
