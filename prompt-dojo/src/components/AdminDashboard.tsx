"use client";

import { useState } from "react";
import type { Challenge } from "@/lib/types";

export function AdminDashboard({
  initialChallenges,
  isAuthenticated,
}: {
  initialChallenges: Challenge[];
  isAuthenticated: boolean;
}) {
  const [authed, setAuthed] = useState(isAuthenticated);
  const [password, setPassword] = useState("");
  const [challenges, setChallenges] = useState(initialChallenges);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    sample_output: "",
  });

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", password }),
    });
    if (res.ok) {
      setAuthed(true);
      setError("");
    } else {
      setError("パスワードが違います");
    }
  }

  async function logout() {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setAuthed(false);
  }

  async function createChallenge(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", ...form }),
    });
    const data = await res.json();
    if (res.ok) {
      setChallenges([data.challenge, ...challenges]);
      setForm({ title: "", description: "", sample_output: "" });
    }
  }

  async function toggleStatus(challenge: Challenge) {
    const newStatus = challenge.status === "active" ? "archived" : "active";
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        id: challenge.id,
        status: newStatus,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setChallenges(
        challenges.map((c) => (c.id === challenge.id ? data.challenge : c)),
      );
    }
  }

  async function removeChallenge(id: number) {
    if (!confirm("この課題を削除しますか？関連する投稿も削除されます。")) return;
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    if (res.ok) {
      setChallenges(challenges.filter((c) => c.id !== id));
    }
  }

  if (!authed) {
    return (
      <form onSubmit={login} className="mx-auto max-w-sm space-y-4">
        <h1 className="text-xl font-bold">管理画面ログイン</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="管理者パスワード"
          className="w-full rounded-lg border px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2 text-white"
        >
          ログイン
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">課題管理</h1>
        <button
          type="button"
          onClick={logout}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ログアウト
        </button>
      </div>

      <form onSubmit={createChallenge} className="space-y-3 rounded-xl border p-4">
        <h2 className="font-medium">新規課題</h2>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="タイトル"
          required
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="説明"
          required
          rows={3}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
        <input
          value={form.sample_output}
          onChange={(e) => setForm({ ...form, sample_output: e.target.value })}
          placeholder="期待する出力例（任意）"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white"
        >
          追加
        </button>
      </form>

      <div className="space-y-3">
        {challenges.map((c) => (
          <div
            key={c.id}
            className="flex items-start justify-between gap-4 rounded-xl border p-4"
          >
            <div>
              <p className="font-medium">{c.title}</p>
              <p className="mt-1 text-sm text-gray-500">{c.description}</p>
              <span
                className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs ${
                  c.status === "active"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {c.status}
              </span>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => toggleStatus(c)}
                className="rounded-lg border px-3 py-1 text-xs"
              >
                {c.status === "active" ? "非公開" : "公開"}
              </button>
              <button
                type="button"
                onClick={() => removeChallenge(c.id)}
                className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-600"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
