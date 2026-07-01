"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ChallengeGenButton } from "@/components/ChallengeGenButton";
import { NicknameSetup } from "@/components/NicknameSetup";

export default function NewChallengePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    sample_output: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "投稿に失敗しました");
      return;
    }

    setSuccess(data.message);
    setTimeout(() => router.push("/"), 2000);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        ← トップ
      </Link>
      <h1 className="mt-4 text-2xl font-bold">課題を投稿</h1>
      <p className="mt-1 text-sm text-gray-500">
        お題を投稿すると、管理者の承認後に公開されます。
      </p>

      <div className="mt-6">
        <NicknameSetup />
      </div>

      <div className="mt-4">
        <ChallengeGenButton
          onGenerated={(c) =>
            setForm({
              title: c.title,
              description: c.description,
              sample_output: c.sample_output,
            })
          }
        />
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">タイトル</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            maxLength={100}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="例: ブログ記事のタイトルを10個提案"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">課題の説明</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={5}
            maxLength={2000}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="挑戦者に何を書いてほしいか説明してください"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            期待する出力例（任意）
          </label>
          <input
            value={form.sample_output}
            onChange={(e) => setForm({ ...form, sample_output: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="例: SEOを意識したタイトル10個"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-emerald-600">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "投稿中..." : "課題を投稿する"}
        </button>
      </form>
    </div>
  );
}
