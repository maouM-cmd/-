"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";

export function ShiftLogForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [productId, setProductId] = useState("");
  const [learnedNote, setLearnedNote] = useState("");
  const [struggledIngredient, setStruggledIngredient] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId ? Number(productId) : null,
        learned_note: learnedNote,
        struggled_ingredient: struggledIngredient,
      }),
    });

    setSaving(false);
    if (res.ok) {
      setDone(true);
      setLearnedNote("");
      setStruggledIngredient("");
      setProductId("");
      router.refresh();
      setTimeout(() => setDone(false), 2500);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {done && (
        <p className="animate-fade-up rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          お疲れさま。記録したよ。
        </p>
      )}

      <label className="block space-y-1">
        <span className="text-sm font-medium">関連する商品（任意）</span>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full rounded-xl border border-[#eadfd4] px-4 py-3"
        >
          <option value="">選択しない</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.brand} / {p.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">今日覚えたこと</span>
        <textarea
          rows={3}
          value={learnedNote}
          onChange={(e) => setLearnedNote(e.target.value)}
          placeholder="新商品の特徴、お客様に伝えたポイントなど"
          className="w-full rounded-xl border border-[#eadfd4] px-4 py-3"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">答えられなかった成分・質問</span>
        <input
          value={struggledIngredient}
          onChange={(e) => setStruggledIngredient(e.target.value)}
          placeholder="例: レチノールの濃度、パラベンの有無"
          className="w-full rounded-xl border border-[#eadfd4] px-4 py-3"
        />
      </label>

      <button
        type="submit"
        disabled={saving || (!learnedNote.trim() && !struggledIngredient.trim())}
        className="w-full rounded-2xl bg-[#c4a484] py-4 text-sm font-semibold text-white disabled:opacity-50"
      >
        {saving ? "保存中..." : "サクッと記録"}
      </button>
    </form>
  );
}
