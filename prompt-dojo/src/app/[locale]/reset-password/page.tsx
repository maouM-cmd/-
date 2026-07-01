"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("パスワードが一致しません");
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
      setError(data.error ?? "更新に失敗しました");
      return;
    }

    router.push("/login");
    router.refresh();
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <p className="text-sm text-red-600">リセットリンクが無効です</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
          再度リクエストする
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Link href="/login" className="text-sm text-indigo-600 hover:underline">
        ← ログイン
      </Link>
      <h1 className="mt-4 text-2xl font-bold">新しいパスワードを設定</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">新しいパスワード</label>
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
          <label className="mb-1 block text-sm font-medium">パスワード（確認）</label>
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
          {loading ? "更新中..." : "パスワードを更新"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">読み込み中...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
