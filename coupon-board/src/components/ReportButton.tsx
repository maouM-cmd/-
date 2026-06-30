"use client";

import { useState } from "react";
import { REPORT_REASONS } from "@/lib/constants-reports";
import type { ReportReason } from "@/lib/types";

export function ReportButton({ dealId }: { dealId: number }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | "">("");
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/deals/${dealId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, detail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error ?? "通報に失敗しました");
        return;
      }

      setDone(true);
      setMessage(data.message);
    } catch {
      setMessage("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-gray-400 underline-offset-2 hover:text-red-500 hover:underline"
      >
        🚩 通報する
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {done ? (
          <div className="text-center">
            <p className="text-3xl">✓</p>
            <p className="mt-3 text-sm text-gray-700">{message}</p>
            <button
              onClick={() => {
                setOpen(false);
                if (message.includes("非表示")) {
                  window.location.href = "/";
                }
              }}
              className="mt-5 rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              閉じる
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-bold text-gray-900">案件を通報する</h3>
            <p className="mt-1 text-sm text-gray-500">
              虚偽・終了済み・詐欺の疑いなどがあれば教えてください
            </p>

            {message && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {message}
              </p>
            )}

            <div className="mt-4 space-y-2">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                    reason === r.value
                      ? "border-red-300 bg-red-50 text-red-800"
                      : "border-gray-200 hover:border-red-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                    className="accent-red-500"
                  />
                  {r.label}
                </label>
              ))}
            </div>

            <textarea
              rows={2}
              placeholder="補足（任意）"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={!reason || loading}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? "送信中..." : "通報する"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
