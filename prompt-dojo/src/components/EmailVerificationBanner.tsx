"use client";

import { useState } from "react";

export function EmailVerificationBanner({
  email,
  verified,
}: {
  email: string | null;
  verified: boolean;
}) {
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
      setMessage(data.message ?? "確認メールを送信しました");
    } else {
      setMessage(data.error ?? "送信に失敗しました");
    }
  }

  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-medium text-amber-900">
        メールアドレスの確認が必要です
      </p>
      <p className="mt-1 text-xs text-amber-800">
        {email} 宛に確認メールを送信しました。投稿・コメントには確認が必要です。
      </p>
      <button
        type="button"
        onClick={resend}
        disabled={loading}
        className="mt-3 rounded-lg bg-amber-600 px-3 py-1.5 text-xs text-white disabled:opacity-50"
      >
        {loading ? "送信中..." : "確認メールを再送"}
      </button>
      {message && <p className="mt-2 text-xs text-amber-900">{message}</p>}
    </div>
  );
}
