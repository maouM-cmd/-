"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import type { Category } from "@/lib/types";
import { getCategoryLabel } from "@/lib/categories";
import { ChallengeGenButton } from "@/components/ChallengeGenButton";
import { NicknameSetup } from "@/components/NicknameSetup";

export default function NewChallengePage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("challenge");
  const tc = useTranslations("common");
  const toff = useTranslations("offline");
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    sample_output: "",
    category_id: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!navigator.onLine) {
      setError(toff("writeDisabled"));
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        category_id: form.category_id ? Number(form.category_id) : undefined,
        tags: form.tags,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Error");
      return;
    }

    setSuccess(data.message);
    setTimeout(() => router.push("/"), 2000);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        {tc("backHome")}
      </Link>
      <h1 className="mt-4 text-2xl font-bold">{t("postTitle")}</h1>
      <p className="mt-1 text-sm text-gray-500">{t("postDesc")}</p>

      <div className="mt-6">
        <NicknameSetup />
      </div>

      <div className="mt-4">
        <ChallengeGenButton
          onGenerated={(c) =>
            setForm((prev) => ({
              ...prev,
              title: c.title,
              description: c.description,
              sample_output: c.sample_output,
              category_id:
                categories.find((cat) => cat.slug === c.suggested_category_slug)?.id.toString() ??
                prev.category_id,
            }))
          }
        />
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">{t("category")}</label>
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">{tc("all")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {getCategoryLabel(c, locale)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{t("tags")}</label>
          <input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder={t("tagsPlaceholder")}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{t("title")}</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            maxLength={100}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{t("description")}</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={5}
            maxLength={2000}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{t("sampleOutput")}</label>
          <input
            value={form.sample_output}
            onChange={(e) => setForm({ ...form, sample_output: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-emerald-600">{success}</p>}

        <button
          type="submit"
          disabled={loading || (typeof navigator !== "undefined" && !navigator.onLine)}
          className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? t("posting") : t("submitChallenge")}
        </button>
      </form>
    </div>
  );
}
