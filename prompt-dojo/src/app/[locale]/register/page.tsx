"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useState } from "react";
import { mapApiError } from "@/lib/map-api-error";
import { mapApiMessage } from "@/lib/map-api-message";

export default function RegisterPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const ta = useTranslations("auth");
  const tc = useTranslations("common");
  const [form, setForm] = useState({ email: "", password: "", display_name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, locale }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(mapApiError(data, t));
      return;
    }

    setSuccess(mapApiMessage(data, t));
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 2000);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        {tc("backHome")}
      </Link>
      <h1 className="mt-4 text-2xl font-bold">{ta("register")}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">{ta("nickname")}</label>
          <input
            type="text"
            value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })}
            required
            maxLength={20}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{ta("email")}</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{ta("passwordMin")}</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={8}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-emerald-600">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? ta("registering") : ta("register")}
        </button>

        <p className="text-center text-sm text-gray-500">
          {ta("hasAccount")}
          <Link href="/login" className="text-indigo-600 hover:underline">
            {ta("login")}
          </Link>
        </p>
      </form>
    </div>
  );
}
