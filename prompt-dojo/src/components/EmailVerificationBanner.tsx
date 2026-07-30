"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { mapApiError } from "@/lib/map-api-error";
import { mapApiMessage } from "@/lib/map-api-message";

export function EmailVerificationBanner({
  email,
  verified,
}: {
  email: string | null;
  verified: boolean;
}) {
  const t = useTranslations();
  const ta = useTranslations("auth");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!email || verified) return null;

  async function resend() {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/verify-email", { method: "POST" });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage(mapApiMessage(data, t));
    } else {
      setMessage(mapApiError(data, t));
    }
  }

  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-medium text-amber-900">{ta("verifyBannerTitle")}</p>
      <p className="mt-1 text-xs text-amber-800">
        {ta("verifyBannerBody", { email })}
      </p>
      <button
        type="button"
        onClick={resend}
        disabled={loading}
        className="mt-3 rounded-lg bg-amber-600 px-3 py-1.5 text-xs text-white disabled:opacity-50"
      >
        {loading ? ta("sending") : ta("resendVerify")}
      </button>
      {message && <p className="mt-2 text-xs text-amber-900">{message}</p>}
    </div>
  );
}
