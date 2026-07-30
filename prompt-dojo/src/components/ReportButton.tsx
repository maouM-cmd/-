"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { REPORT_REASONS } from "@/lib/constants-reports";
import { mapApiError } from "@/lib/map-api-error";
import { mapApiMessage } from "@/lib/map-api-message";
import type { ReportReason } from "@/lib/types";

export function ReportButton({ submissionId }: { submissionId: number }) {
  const router = useRouter();
  const t = useTranslations();
  const tr = useTranslations("report");
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | "">("");
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) return;

    setLoading(true);
    setMessage("");

    const res = await fetch(`/api/submissions/${submissionId}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, detail }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(mapApiError(data, t));
      return;
    }

    setDone(true);
    setHidden(!!data.hidden);
    setMessage(mapApiMessage(data, t));
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-gray-400 hover:text-red-500"
      >
        {tr("open")}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {done ? (
          <div className="text-center">
            <p className="text-sm text-gray-700">{message}</p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                if (hidden) {
                  router.push("/");
                }
              }}
              className="mt-5 rounded-full bg-indigo-600 px-6 py-2 text-sm text-white"
            >
              {tr("close")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-bold">{tr("title")}</h3>
            <p className="mt-1 text-sm text-gray-500">{tr("desc")}</p>

            {message && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {message}
              </p>
            )}

            <div className="mt-4 space-y-2">
              {REPORT_REASONS.map((value) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                    reason === value
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={value}
                    checked={reason === value}
                    onChange={() => setReason(value)}
                  />
                  {tr(`reasons.${value}`)}
                </label>
              ))}
            </div>

            <textarea
              rows={2}
              placeholder={tr("detailPlaceholder")}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className="mt-4 w-full rounded-xl border px-4 py-2 text-sm"
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border py-2.5 text-sm"
              >
                {tr("cancel")}
              </button>
              <button
                type="submit"
                disabled={!reason || loading}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm text-white disabled:opacity-50"
              >
                {loading ? tr("sending") : tr("submit")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
