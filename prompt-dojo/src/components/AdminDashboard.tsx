"use client";

import { useState } from "react";
import type { AdminSubmission, Challenge, Report } from "@/lib/types";
import { REPORT_REASONS } from "@/lib/constants-reports";

type Tab = "challenges" | "pending" | "reports" | "submissions";

interface AdminData {
  challenges: Challenge[];
  pending: Challenge[];
  reports: Report[];
  submissions: AdminSubmission[];
}

export function AdminDashboard({
  isAuthenticated,
  initialData,
}: {
  isAuthenticated: boolean;
  initialData: AdminData | null;
}) {
  const [authed, setAuthed] = useState(isAuthenticated);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("challenges");
  const [data, setData] = useState<AdminData | null>(initialData);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    sample_output: "",
  });

  async function loadData() {
    const res = await fetch("/api/admin");
    if (res.ok) {
      setData(await res.json());
    }
  }

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
      await loadData();
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
    setData(null);
  }

  async function adminAction(body: Record<string, unknown>) {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) await loadData();
    return res.ok;
  }

  async function createChallenge(e: React.FormEvent) {
    e.preventDefault();
    const ok = await adminAction({ action: "create", ...form });
    if (ok) setForm({ title: "", description: "", sample_output: "" });
  }

  if (!authed || !data) {
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
        <button type="submit" className="w-full rounded-lg bg-indigo-600 py-2 text-white">
          ログイン
        </button>
      </form>
    );
  }

  const { challenges, pending, reports, submissions } = data;

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "challenges", label: "課題" },
    { key: "pending", label: "承認待ち", count: pending.length },
    { key: "reports", label: "通報", count: reports.length },
    { key: "submissions", label: "投稿" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">管理画面</h1>
        <button type="button" onClick={logout} className="text-sm text-gray-500">
          ログアウト
        </button>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-2 text-sm ${
              tab === t.key
                ? "bg-indigo-600 text-white"
                : "border border-indigo-200 text-indigo-700"
            }`}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && ` (${t.count})`}
          </button>
        ))}
      </nav>

      {tab === "challenges" && (
        <>
          <form onSubmit={createChallenge} className="space-y-3 rounded-xl border p-4">
            <h2 className="font-medium">新規課題（即時公開）</h2>
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
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">
              追加
            </button>
          </form>

          <div className="space-y-3">
            {challenges.map((c) => (
              <div key={c.id} className="rounded-xl border p-4">
                <p className="font-medium">{c.title}</p>
                <p className="mt-1 text-sm text-gray-500">{c.description}</p>
                <div className="mt-2 flex gap-2">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {c.status}
                  </span>
                  {c.author_name && (
                    <span className="text-xs text-gray-400">by {c.author_name}</span>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      adminAction({
                        action: "update",
                        id: c.id,
                        status: c.status === "active" ? "archived" : "active",
                      })
                    }
                    className="ml-auto text-xs text-indigo-600"
                  >
                    {c.status === "active" ? "非公開" : "公開"}
                  </button>
                  <button
                    type="button"
                    onClick={() => adminAction({ action: "delete", id: c.id })}
                    className="text-xs text-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "pending" && (
        <div className="space-y-3">
          {pending.length === 0 ? (
            <p className="text-sm text-gray-500">承認待ちの課題はありません</p>
          ) : (
            pending.map((c) => (
              <div key={c.id} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="font-medium">{c.title}</p>
                <p className="mt-1 text-sm text-gray-600">{c.description}</p>
                {c.author_name && (
                  <p className="mt-1 text-xs text-gray-500">投稿者: {c.author_name}</p>
                )}
                <button
                  type="button"
                  onClick={() => adminAction({ action: "approve", id: c.id })}
                  className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white"
                >
                  承認して公開
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "reports" && (
        <div className="space-y-3">
          {reports.length === 0 ? (
            <p className="text-sm text-gray-500">通報はありません</p>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="rounded-xl border p-4 text-sm">
                <p className="font-medium">
                  {REPORT_REASONS.find((x) => x.value === r.reason)?.label ?? r.reason}
                </p>
                <p className="mt-1 text-gray-600">{r.submission_preview}...</p>
                <p className="mt-1 text-xs text-gray-400">
                  通報者: {r.author_name} / {r.created_at}
                </p>
                {r.detail && <p className="mt-1 text-gray-500">{r.detail}</p>}
              </div>
            ))
          )}
        </div>
      )}

      {tab === "submissions" && (
        <div className="space-y-3">
          {submissions.map((s) => (
            <div
              key={s.id}
              className={`rounded-xl border p-4 ${s.is_hidden ? "border-red-200 bg-red-50" : ""}`}
            >
              <p className="text-sm font-medium">
                {s.author_name} — {s.challenge_title}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-gray-500">{s.prompt_text}</p>
              <p className="mt-1 text-xs text-gray-400">
                自動{s.auto_score}点 / 通報{s.report_count}件 / コメント{s.comment_count}件
                {s.is_hidden ? " / 非表示" : ""}
              </p>
              <div className="mt-2 flex gap-2">
                {s.is_hidden ? (
                  <button
                    type="button"
                    onClick={() =>
                      adminAction({ action: "restore_submission", id: s.id })
                    }
                    className="text-xs text-emerald-600"
                  >
                    復活
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => adminAction({ action: "hide_submission", id: s.id })}
                    className="text-xs text-amber-600"
                  >
                    非表示
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => adminAction({ action: "delete_submission", id: s.id })}
                  className="text-xs text-red-600"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
