"use client";

import Link from "next/link";
import { useState } from "react";

export function AuthForm({
  mode,
  oauthError,
}: {
  mode: "login" | "signup";
  oauthError?: string | null;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const body =
      mode === "login"
        ? { email, password }
        : { email, password, display_name: displayName };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "エラーが発生しました");
      return;
    }

    window.location.href = mode === "signup" ? "/profile" : "/discover";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">表示名</label>
          <input
            className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="たろう"
            required
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
        <input
          type="email"
          className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">パスワード</label>
        <input
          type="password"
          className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === "signup" ? "8文字以上" : "••••••••"}
          minLength={mode === "signup" ? 8 : 1}
          required
        />
      </div>
      {oauthError && <p className="text-sm text-red-600">{oauthError}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-rose-500 py-3 font-bold text-white hover:bg-rose-600 disabled:opacity-50"
      >
        {loading ? "処理中..." : mode === "login" ? "ログイン" : "アカウント作成"}
      </button>
      <p className="text-center text-sm text-gray-500">
        {mode === "login" ? (
          <>
            アカウントがない？{" "}
            <Link href="/signup" className="font-medium text-rose-600 hover:underline">
              新規登録
            </Link>
          </>
        ) : (
          <>
            既にアカウントがある？{" "}
            <Link href="/login" className="font-medium text-rose-600 hover:underline">
              ログイン
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
