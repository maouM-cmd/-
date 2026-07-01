"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useState } from "react";
import { mapApiError } from "@/lib/map-api-error";

export default function ForgotPasswordPage() {
  const t = useTranslations();
  const tf = useTranslations("forgot");
  const ta = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(mapApiError(data, t, "GENERIC_ERROR"));
      return;
    }

    setMessage(tf("sent"));
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Link href="/login" className="text-sm text-indigo-600 hover:underline">
        {ta("backToLogin")}
      </Link>
      <h1 className="mt-4 text-2xl font-bold">{tf("title")}</h1>
      <p className="mt-2 text-sm text-gray-600">{tf("desc")}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">{ta("email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-emerald-600">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? tf("sending") : tf("submit")}
        </button>
      </form>
    </div>
  );
}
