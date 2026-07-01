"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Error");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        {tc("backHome")}
      </Link>
      <h1 className="mt-4 text-2xl font-bold">{t("login")}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">{t("email")}</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium">{t("password")}</label>
            <Link
              href="/forgot-password"
              className="text-xs text-indigo-600 hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? t("loggingIn") : t("login")}
        </button>

        <p className="text-center text-sm text-gray-500">
          {t("noAccount")}
          <Link href="/register" className="text-indigo-600 hover:underline">
            {t("register")}
          </Link>
        </p>
      </form>
    </div>
  );
}
