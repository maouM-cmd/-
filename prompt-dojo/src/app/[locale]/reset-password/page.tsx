"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { mapApiError } from "@/lib/map-api-error";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const t = useTranslations();
  const tr = useTranslations("reset");
  const ta = useTranslations("auth");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError(tr("mismatch"));
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(mapApiError(data, t));
      return;
    }

    router.push("/login");
    router.refresh();
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <p className="text-sm text-red-600">{tr("invalidLink")}</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
          {tr("retry")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Link href="/login" className="text-sm text-indigo-600 hover:underline">
        {ta("backToLogin")}
      </Link>
      <h1 className="mt-4 text-2xl font-bold">{tr("title")}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">{tr("newPassword")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{tr("confirm")}</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? tr("updating") : tr("submit")}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  const tc = useTranslations("common");

  return (
    <Suspense fallback={<div className="p-8 text-center">{tc("loading")}</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
