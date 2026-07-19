"use client";

import { useEffect, useState } from "react";
import { formatSeconds } from "@/lib/utils";

interface PracticeTimerProps {
  targetSeconds: number;
  running: boolean;
  onElapsed?: () => void;
}

export function PracticeTimer({
  targetSeconds,
  running,
  onElapsed,
}: PracticeTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;

    const interval = window.setInterval(() => {
      setElapsed((current) => {
        const next = current + 1;
        if (next >= targetSeconds) {
          onElapsed?.();
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running, targetSeconds, onElapsed]);

  const remaining = Math.max(targetSeconds - elapsed, 0);
  const isOvertime = elapsed > targetSeconds;
  const progress = Math.min((elapsed / targetSeconds) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">残り時間</p>
          <p
            className={`text-4xl font-bold tabular-nums ${
              isOvertime ? "text-rose-400" : "text-white"
            }`}
          >
            {formatSeconds(remaining)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">目安 {formatSeconds(targetSeconds)}</p>
          <p className="text-sm tabular-nums text-slate-300">
            経過 {formatSeconds(elapsed)}
          </p>
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
        <div
          className={`h-full transition-all ${
            isOvertime ? "bg-rose-500" : "bg-sky-400"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
