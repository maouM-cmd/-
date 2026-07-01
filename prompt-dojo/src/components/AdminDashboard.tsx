"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import type { AdminSubmission, Category, Challenge, GeneratedChallenge, Report } from "@/lib/types";
import { ChallengeGenButton } from "@/components/ChallengeGenButton";
import { getCategoryLabel } from "@/lib/categories";
import { mapApiError } from "@/lib/map-api-error";

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
  const locale = useLocale();
  const t = useTranslations();
  const ta = useTranslations("admin");
  const tr = useTranslations("report");
  const [authed, setAuthed] = useState(isAuthenticated);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("challenges");
  const [data, setData] = useState<AdminData | null>(initialData);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    sample_output: "",
    category_id: "",
    tags: "",
  });

  async function loadData() {
    const res = await fetch("/api/admin");
    if (res.ok) {
      setData(await res.json());
    }
    const catRes = await fetch("/api/categories");
    if (catRes.ok) {
      const catData = await catRes.json();
      setCategories(catData.categories ?? []);
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
      const errData = await res.json();
      setError(mapApiError(errData, t));
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
    if (ok) setForm({ title: "", description: "", sample_output: "", category_id: "", tags: "" });
  }

  if (!authed || !data) {
    return (
      <form onSubmit={login} className="mx-auto max-w-sm space-y-4">
        <h1 className="text-xl font-bold">{ta("loginTitle")}</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={ta("passwordPlaceholder")}
          className="w-full rounded-lg border px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-indigo-600 py-2 text-white">
          {ta("login")}
        </button>
      </form>
    );
  }

  const { challenges, pending, reports, submissions } = data;

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "challenges", label: ta("tabs.challenges") },
    { key: "pending", label: ta("tabs.pending"), count: pending.length },
    { key: "reports", label: ta("tabs.reports"), count: reports.length },
    { key: "submissions", label: ta("tabs.submissions") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{ta("title")}</h1>
        <button type="button" onClick={logout} className="text-sm text-gray-500">
          {ta("logout")}
        </button>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`rounded-full px-4 py-2 text-sm ${
              tab === item.key
                ? "bg-indigo-600 text-white"
                : "border border-indigo-200 text-indigo-700"
            }`}
          >
            {item.label}
            {item.count !== undefined && item.count > 0 && ` (${item.count})`}
          </button>
        ))}
      </nav>

      {tab === "challenges" && (
        <>
          <form onSubmit={createChallenge} className="space-y-3 rounded-xl border p-4">
            <h2 className="font-medium">{ta("newChallenge")}</h2>
            <ChallengeGenButton
              onGenerated={(c: GeneratedChallenge) =>
                setForm((prev) => ({
                  ...prev,
                  title: c.title,
                  description: c.description,
                  sample_output: c.sample_output,
                }))
              }
            />
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={ta("titlePlaceholder")}
              required
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder={ta("descriptionPlaceholder")}
              required
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
            <input
              value={form.sample_output}
              onChange={(e) => setForm({ ...form, sample_output: e.target.value })}
              placeholder={ta("sampleOutputPlaceholder")}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">{ta("categoryDefault")}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {getCategoryLabel(c, locale)}
                </option>
              ))}
            </select>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder={ta("tagsPlaceholder")}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">
              {ta("add")}
            </button>
          </form>

          <div className="space-y-3">
            {challenges.map((c) => (
              <div key={c.id} className="rounded-xl border p-4">
                <p className="font-medium">{c.title}</p>
                <p className="mt-1 text-sm text-gray-500">{c.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.category && (
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                      {getCategoryLabel(c.category, locale)}
                    </span>
                  )}
                  {c.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full bg-cyan-50 px-2 py-0.5 text-xs text-cyan-700"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {c.status}
                  </span>
                  {c.author_name && (
                    <span className="text-xs text-gray-400">
                      {ta("by", { name: c.author_name })}
                    </span>
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
                    {c.status === "active" ? ta("unpublish") : ta("publish")}
                  </button>
                  <button
                    type="button"
                    onClick={() => adminAction({ action: "delete", id: c.id })}
                    className="text-xs text-red-600"
                  >
                    {ta("delete")}
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
            <p className="text-sm text-gray-500">{ta("noPending")}</p>
          ) : (
            pending.map((c) => (
              <div key={c.id} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="font-medium">{c.title}</p>
                <p className="mt-1 text-sm text-gray-600">{c.description}</p>
                {c.author_name && (
                  <p className="mt-1 text-xs text-gray-500">
                    {ta("author", { name: c.author_name })}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => adminAction({ action: "approve", id: c.id })}
                  className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white"
                >
                  {ta("approve")}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "reports" && (
        <div className="space-y-3">
          {reports.length === 0 ? (
            <p className="text-sm text-gray-500">{ta("noReports")}</p>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="rounded-xl border p-4 text-sm">
                <p className="font-medium">
                  {tr(`reasons.${r.reason}`)}
                </p>
                <p className="mt-1 text-gray-600">{r.submission_preview}...</p>
                <p className="mt-1 text-xs text-gray-400">
                  {ta("reporter", { name: r.author_name ?? "", date: r.created_at })}
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
                {ta("stats", {
                  auto: s.auto_score,
                  reports: s.report_count,
                  comments: s.comment_count,
                })}
                {s.is_hidden ? ` / ${ta("hidden")}` : ""}
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
                    {ta("restore")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => adminAction({ action: "hide_submission", id: s.id })}
                    className="text-xs text-amber-600"
                  >
                    {ta("hide")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => adminAction({ action: "delete_submission", id: s.id })}
                  className="text-xs text-red-600"
                >
                  {ta("delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
