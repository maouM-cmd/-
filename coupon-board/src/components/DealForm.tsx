"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import type { Category } from "@/lib/types";

export function DealForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    service_name: "",
    referrer_reward: "",
    referee_reward: "",
    referrer_reward_value: "",
    referee_reward_value: "",
    referral_link: "",
    referral_code: "",
    conditions: "",
    description: "",
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

    if (!form.referral_link.trim() && !form.referral_code.trim()) {
      setError("招待リンクまたは招待コードのどちらかは必須です");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "投稿に失敗しました");
        return;
      }

      router.push(`/deal/${data.id}`);
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
          placeholder="例: PayPay、メルカリ、SBI証券"
          value={form.service_name}
          onChange={(e) => updateField("service_name", e.target.value)}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="紹介者特典（あなたがもらえる）" required>
          <input
            type="text"
            required
            placeholder="例: 500円、1000P"
            value={form.referrer_reward}
            onChange={(e) => updateField("referrer_reward", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="被紹介者特典（相手がもらえる）" required>
          <input
            type="text"
            required
            placeholder="例: 500円、初月無料"
            value={form.referee_reward}
            onChange={(e) => updateField("referee_reward", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="紹介者特典の金額（並び替え用・任意）">
          <input
            type="number"
            placeholder="例: 500"
            value={form.referrer_reward_value}
            onChange={(e) => updateField("referrer_reward_value", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="被紹介者特典の金額（並び替え用・任意）">
          <input
            type="number"
            placeholder="例: 500"
            value={form.referee_reward_value}
            onChange={(e) => updateField("referee_reward_value", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="招待リンク">
        <input
          type="url"
          placeholder="https://... （リンクまたはコードのどちらか必須）"
          value={form.referral_link}
          onChange={(e) => updateField("referral_link", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="招待コード">
        <input
          type="text"
          placeholder="コードのみの場合はこちら"
          value={form.referral_code}
          onChange={(e) => updateField("referral_code", e.target.value)}
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

      <Field label="利用条件">
        <textarea
          rows={3}
          placeholder="新規限定、本人確認必要、上限あり など"
          value={form.conditions}
          onChange={(e) => updateField("conditions", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="キャンペーン期限">
        <input
          type="date"
          value={form.expires_at}
          onChange={(e) => updateField("expires_at", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="補足・おすすめポイント">
        <textarea
          rows={3}
          placeholder="使い方のコツ、注意点など"
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
        className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3.5 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-fuchsia-600 disabled:opacity-60"
      >
        {loading ? "投稿中..." : "招待キャンペーンを投稿する"}
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
        {required && <span className="ml-1 text-violet-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100";
