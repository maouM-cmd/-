"use client";

import type { DisplayMode } from "@/lib/types";

interface DisplayModeToggleProps {
  mode: DisplayMode;
  onChange: (mode: DisplayMode) => void;
  className?: string;
}

export function DisplayModeToggle({
  mode,
  onChange,
  className = "",
}: DisplayModeToggleProps) {
  return (
    <div className={`inline-flex rounded-xl bg-slate-100 p-1 ${className}`}>
      <button
        type="button"
        onClick={() => onChange("keypoints")}
        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
          mode === "keypoints"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-600"
        }`}
      >
        要点
      </button>
      <button
        type="button"
        onClick={() => onChange("full")}
        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
          mode === "full" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
        }`}
      >
        全文
      </button>
    </div>
  );
}
