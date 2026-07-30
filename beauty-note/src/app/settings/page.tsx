"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AppSettings } from "@/lib/types";
import { DEFAULT_CHEER_MESSAGE } from "@/lib/ingredients";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  async function save(updates: Partial<AppSettings>) {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    setSettings(data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!settings) {
    return (
      <main className="px-4 py-6">
        <p className="text-sm text-[#6b6560]">読み込み中...</p>
      </main>
    );
  }

  return (
    <main className="px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">設定</h1>
      </header>

      {saved && (
        <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          保存しました
        </p>
      )}

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          save({
            staff_name: String(form.get("staff_name") ?? ""),
            shop_name: String(form.get("shop_name") ?? ""),
            pin_limit: Number(form.get("pin_limit") ?? 8),
            cheer_message: String(form.get("cheer_message") ?? ""),
          });
        }}
      >
        <label className="block space-y-1">
          <span className="text-sm font-medium">あなたの名前</span>
          <input
            name="staff_name"
            defaultValue={settings.staff_name}
            placeholder="例: ゆい"
            className="w-full rounded-xl border border-[#eadfd4] px-4 py-3"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">店舗名</span>
          <input
            name="shop_name"
            defaultValue={settings.shop_name}
            placeholder="例: ○○百貨店 コスメカウンター"
            className="w-full rounded-xl border border-[#eadfd4] px-4 py-3"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">ピン留め上限</span>
          <input
            name="pin_limit"
            type="number"
            min={1}
            max={12}
            defaultValue={settings.pin_limit}
            className="w-full rounded-xl border border-[#eadfd4] px-4 py-3"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">応援メッセージ</span>
          <textarea
            name="cheer_message"
            rows={3}
            defaultValue={settings.cheer_message || DEFAULT_CHEER_MESSAGE}
            className="w-full rounded-xl border border-[#eadfd4] px-4 py-3"
          />
          <p className="text-xs text-[#6b6560]">
            暗記完了時と印刷シートのフッターに表示されます
          </p>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-2xl bg-[#c4a484] py-4 text-sm font-semibold text-white"
        >
          {saving ? "保存中..." : "保存する"}
        </button>
      </form>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-bold">使い方</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-[#4a4541]">
          <li>出勤前10分 — 暗記モードで今日の商品を復習</li>
          <li>印刷 — 成分シートをPDF保存 or 印刷してポケットへ</li>
          <li>退勤後 — つまずいた成分や覚えたことをメモ</li>
        </ol>
        <Link href="/faq" className="block text-sm text-[#a88668]">
          成分FAQを見る →
        </Link>
      </section>

      <section className="mt-8">
        <button
          type="button"
          onClick={() => {
            window.open("/api/settings?export=1", "_blank");
          }}
          className="w-full rounded-2xl border border-[#eadfd4] bg-white py-3 text-sm font-semibold text-[#a88668]"
        >
          データをエクスポート（JSON）
        </button>
      </section>
    </main>
  );
}
