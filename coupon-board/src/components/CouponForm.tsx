"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import type { Category } from "@/lib/types";

export function CouponForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    service_name: "",
    title: "",
    description: "",
    coupon_code: "",
    discount: "",
    url: "",
    category: "other" as Category,
    expires_at: "",
    author_name: "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "投稿に失敗しました");
        return;
      }

      router.push(`/coupon/${data.id}`);
      router.refresh();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Field label="サービス名" required>
        <input
          type="text"
          required
          placeholder="例: Amazon、メルカリ、Netflix"
          value={form.service_name}
          onChange={(e) => updateField("service_name", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="クーポンタイトル" required>
        <input
          type="text"
          required
          placeholder="例: 新規会員登録で500円オフ"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="割引内容" required>
        <input
          type="text"
          required
          placeholder="例: 500円OFF、初月無料、10%OFF"
          value={form.discount}
          onChange={(e) => updateField("discount", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="クーポンコード">
        <input
          type="text"
          placeholder="コードがない場合は空欄でOK"
          value={form.coupon_code}
          onChange={(e) => updateField("coupon_code", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="サービスURL" required>
        <input
          type="url"
          required
          placeholder="https://..."
          value={form.url}
          onChange={(e) => updateField("url", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="カテゴリ" required>
        <select
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
          className={inputClass}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.emoji} {cat.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="有効期限">
        <input
          type="date"
          value={form.expires_at}
          onChange={(e) => updateField("expires_at", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="詳細・使い方">
        <textarea
          rows={4}
          placeholder="利用条件、注意事項、おすすめポイントなど"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="ニックネーム">
        <input
          type="text"
          placeholder="空欄の場合は「匿名」"
          value={form.author_name}
          onChange={(e) => updateField("author_name", e.target.value)}
          className={inputClass}
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-200 transition hover:from-orange-600 hover:to-rose-600 disabled:opacity-60"
      >
        {loading ? "投稿中..." : "クーポンを投稿する"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-orange-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";
