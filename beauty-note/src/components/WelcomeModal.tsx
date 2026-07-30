"use client";

import { useState } from "react";
import { SITE_NAME } from "@/lib/ingredients";

export function WelcomeModal({
  staffName,
  seen,
}: {
  staffName: string;
  seen: boolean;
}) {
  const [open, setOpen] = useState(!seen);

  if (!open) return null;

  async function dismiss() {
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ welcome_seen: true }),
    });
    setOpen(false);
  }

  return (
    <div className="no-print fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="animate-fade-up w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <p className="text-center text-3xl">🌷</p>
        <h2 className="mt-3 text-center text-xl font-bold text-[#2d2a26]">
          {SITE_NAME}へようこそ
        </h2>
        <p className="mt-3 text-center text-sm leading-relaxed text-[#6b6560]">
          {staffName ? `${staffName}さん、` : ""}
          全部覚えなくていいよ。
          <br />
          出勤前に暗記、仕事中は印刷シート、退勤後にメモ。
          <br />
          この3ステップだけで大丈夫。
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="mt-6 w-full rounded-2xl bg-[#c4a484] py-3 text-sm font-semibold text-white"
        >
          はじめる
        </button>
      </div>
    </div>
  );
}
