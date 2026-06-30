"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { REPORT_REASONS } from "@/lib/constants-reports";
import type { AdminDeal, ReportReason } from "@/lib/types";

interface AdminData {
  deals: AdminDeal[];
  reports: {
    id: number;
    deal_id: number;
    reason: ReportReason;
    detail: string;
    created_at: string;
    service_name: string;
  }[];
}

export function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    const res = await fetch("/api/admin");
    if (res.ok) {
      setData(await res.json());
      setAuthed(true);
    }
  }

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin");
      if (res.ok) {
        setData(await res.json());
        setAuthed(true);
      }
    })();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      await loadData();
    } else {
      setError("パスワードが違います");
    }
    setLoading(false);
  }

  async function handleAction(dealId: number, action: string) {
    await fetch(`/api/admin/deals/${dealId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    await loadData();
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
    setData(null);
  }

  if (!authed) {
    return (
      <form
        onSubmit={handleLogin}
        className="mx-auto max-w-sm rounded-2xl border border-violet-100 bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-bold text-gray-900">管理画面</h1>
        <p className="mt-1 text-sm text-gray-500">運営者パスワードを入力</p>
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400"
          placeholder="パスワード"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          ログイン
        </button>
      </form>
    );
  }

  if (!data) return null;

  const reasonLabel = (r: ReportReason) =>
    REPORT_REASONS.find((x) => x.value === r)?.label ?? r;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">管理画面</h1>
          <p className="text-sm text-gray-500">
            案件 {data.deals.length} 件 / 通報 {data.reports.length} 件
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/" className="text-sm text-violet-600 hover:underline">
            サイトへ
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ログアウト
          </button>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-bold">最近の通報</h2>
        {data.reports.length === 0 ? (
          <p className="text-sm text-gray-500">通報はありません</p>
        ) : (
          <ul className="space-y-2">
            {data.reports.slice(0, 10).map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-red-100 bg-red-50/50 px-4 py-3 text-sm"
              >
                <span className="font-medium">{r.service_name}</span>
                <span className="mx-2 text-gray-400">|</span>
                {reasonLabel(r.reason)}
                {r.detail && (
                  <span className="text-gray-600"> — {r.detail}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">全案件</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">サービス</th>
                <th className="px-4 py-3">状態</th>
                <th className="px-4 py-3">通報</th>
                <th className="px-4 py-3">使えた/不可</th>
                <th className="px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {data.deals.map((d) => (
                <tr key={d.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{d.id}</td>
                  <td className="px-4 py-3 font-medium">{d.service_name}</td>
                  <td className="px-4 py-3">
                    {d.is_hidden ? (
                      <span className="text-red-600">非表示</span>
                    ) : (
                      <span className="text-green-600">公開中</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{d.report_count}</td>
                  <td className="px-4 py-3">
                    {d.worked_count}/{d.failed_count}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/deal/${d.id}`}
                        className="text-violet-600 hover:underline"
                      >
                        見る
                      </Link>
                      {d.is_hidden ? (
                        <button
                          onClick={() => handleAction(d.id, "unhide")}
                          className="text-green-600 hover:underline"
                        >
                          復活
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction(d.id, "hide")}
                          className="text-orange-600 hover:underline"
                        >
                          非表示
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm("本当に削除しますか？")) {
                            handleAction(d.id, "delete");
                          }
                        }}
                        className="text-red-600 hover:underline"
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
