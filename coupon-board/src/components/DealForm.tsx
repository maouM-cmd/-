"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import type { Category } from "@/lib/types";

export function DealForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setScreenshot(null);
      setPreview(null);
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("JPEG、PNG、WebP形式のみアップロードできます");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("ファイルサイズは5MB以下にしてください");
      return;
    }

    setError("");
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  }

  function clearScreenshot() {
    setScreenshot(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      const formData = new FormData();
      for (const [key, value] of Object.entries(form)) {
        formData.append(key, value);
      }
      if (screenshot) {
        formData.append("screenshot", screenshot);
      }

      const res = await fetch("/api/deals", {
        method: "POST",
        body: formData,
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

      <Field
        label="スクリーンショット"
        hint="キャンペーン画面のスクショ（推奨・JPEG/PNG/WebP、5MB以下）"
        recommended
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-violet-700 hover:file:bg-violet-200"
        />
        {preview && (
          <div className="relative mt-3 overflow-hidden rounded-xl border border-violet-100">
            <Image
              src={preview}
              alt="プレビュー"
              width={600}
              height={400}
              className="h-auto max-h-64 w-full object-contain bg-gray-50"
              unoptimized
            />
            <button
              type="button"
              onClick={clearScreenshot}
              className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-1 text-xs text-white hover:bg-black/70"
            >
              削除
            </button>
          </div>
        )}
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
  recommended,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  recommended?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-violet-500">*</span>}
        {recommended && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            推奨
          </span>
        )}
      </label>
      {hint && <p className="mb-1.5 text-xs text-gray-400">{hint}</p>}
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100";
