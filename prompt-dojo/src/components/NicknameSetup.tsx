"use client";

import { useEffect, useState } from "react";
import { LoginButton } from "./LoginButton";

export function NicknameSetup() {
  const [name, setName] = useState("");
  const [current, setCurrent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/session")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.display_name) setCurrent(d.user.display_name);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: name }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "エラーが発生しました");
      return;
    }
    setCurrent(data.user.display_name);
    setName("");
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {current ? (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-sm text-indigo-800">
            ログイン中: <strong>{current}</strong>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex-1 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4"
          >
            <p className="text-sm font-medium text-amber-900">
              投稿・評価にはニックネームの設定が必要です
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ニックネーム（1〜20文字）"
                maxLength={20}
                className="min-w-0 flex-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {loading ? "設定中..." : "設定する"}
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          </form>
        )}
        <LoginButton />
      </div>
    </div>
  );
}
