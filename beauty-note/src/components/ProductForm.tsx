"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORY_LABELS,
  COMMON_INGREDIENTS,
  INGREDIENT_TAGS,
  SKIN_TYPE_LABELS,
} from "@/lib/ingredients";
import type {
  IngredientTagId,
  Product,
  ProductCategory,
  SkinType,
} from "@/lib/types";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ProductCategory[];
const SKIN_TYPES = Object.keys(SKIN_TYPE_LABELS) as SkinType[];

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    brand: product?.brand ?? "",
    name: product?.name ?? "",
    shade: product?.shade ?? "",
    category: product?.category ?? "other",
    key_ingredients: product?.key_ingredients ?? [],
    ingredient_tags: product?.ingredient_tags ?? [],
    skin_types: product?.skin_types ?? [],
    avoid_for: product?.avoid_for ?? "",
    talking_points: product?.talking_points ?? "",
    notes: product?.notes ?? "",
    is_pinned: product?.is_pinned ?? false,
  });
  const [ingredientInput, setIngredientInput] = useState("");

  function toggleTag(tag: IngredientTagId) {
    setForm((f) => ({
      ...f,
      ingredient_tags: f.ingredient_tags.includes(tag)
        ? f.ingredient_tags.filter((t) => t !== tag)
        : [...f.ingredient_tags, tag],
    }));
  }

  function toggleSkin(skin: SkinType) {
    setForm((f) => ({
      ...f,
      skin_types: f.skin_types.includes(skin)
        ? f.skin_types.filter((s) => s !== skin)
        : [...f.skin_types, skin],
    }));
  }

  function addIngredient(value: string) {
    const trimmed = value.trim();
    if (!trimmed || form.key_ingredients.includes(trimmed)) return;
    setForm((f) => ({
      ...f,
      key_ingredients: [...f.key_ingredients, trimmed],
    }));
    setIngredientInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = product ? `/api/products/${product.id}` : "/api/products";
    const method = product ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "保存に失敗しました");
      return;
    }

    router.push(`/products/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <label className="block space-y-1">
        <span className="text-sm font-medium">ブランド</span>
        <input
          required
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
          className="w-full rounded-xl border border-[#eadfd4] px-4 py-3"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">商品名</span>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-xl border border-[#eadfd4] px-4 py-3"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">色番・容量</span>
        <input
          value={form.shade}
          onChange={(e) => setForm({ ...form, shade: e.target.value })}
          className="w-full rounded-xl border border-[#eadfd4] px-4 py-3"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">カテゴリ</span>
        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value as ProductCategory })
          }
          className="w-full rounded-xl border border-[#eadfd4] px-4 py-3"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-2">
        <span className="text-sm font-medium">主要成分</span>
        <div className="flex flex-wrap gap-2">
          {form.key_ingredients.map((ing) => (
            <button
              key={ing}
              type="button"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  key_ingredients: f.key_ingredients.filter((i) => i !== ing),
                }))
              }
              className="rounded-full bg-[#f6ebe1] px-3 py-1 text-xs text-[#a88668]"
            >
              {ing} ×
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            placeholder="成分を入力"
            className="flex-1 rounded-xl border border-[#eadfd4] px-4 py-3"
          />
          <button
            type="button"
            onClick={() => addIngredient(ingredientInput)}
            className="rounded-xl bg-[#c4a484] px-4 text-sm font-semibold text-white"
          >
            追加
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_INGREDIENTS.map((ing) => (
            <button
              key={ing}
              type="button"
              onClick={() => addIngredient(ing)}
              className="rounded-full border border-[#eadfd4] px-2.5 py-1 text-[11px] text-[#6b6560]"
            >
              + {ing}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">成分タグ</span>
        <div className="flex flex-wrap gap-2">
          {INGREDIENT_TAGS.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset ${
                form.ingredient_tags.includes(tag.id)
                  ? "bg-[#c4a484] text-white ring-[#c4a484]"
                  : "bg-white text-[#6b6560] ring-[#eadfd4]"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">向いている肌質</span>
        <div className="flex flex-wrap gap-2">
          {SKIN_TYPES.map((skin) => (
            <button
              key={skin}
              type="button"
              onClick={() => toggleSkin(skin)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset ${
                form.skin_types.includes(skin)
                  ? "bg-[#c4a484] text-white ring-[#c4a484]"
                  : "bg-white text-[#6b6560] ring-[#eadfd4]"
              }`}
            >
              {SKIN_TYPE_LABELS[skin]}
            </button>
          ))}
        </div>
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-medium">避けた方がいい人</span>
        <input
          value={form.avoid_for}
          onChange={(e) => setForm({ ...form, avoid_for: e.target.value })}
          className="w-full rounded-xl border border-[#eadfd4] px-4 py-3"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">30秒トーク</span>
        <textarea
          rows={3}
          value={form.talking_points}
          onChange={(e) => setForm({ ...form, talking_points: e.target.value })}
          className="w-full rounded-xl border border-[#eadfd4] px-4 py-3"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">メモ</span>
        <textarea
          rows={2}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full rounded-xl border border-[#eadfd4] px-4 py-3"
        />
      </label>

      <label className="flex items-center gap-3 rounded-xl border border-[#eadfd4] bg-[#fff9f5] px-4 py-3">
        <input
          type="checkbox"
          checked={form.is_pinned}
          onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
          className="h-4 w-4"
        />
        <span className="text-sm font-medium">今日覚える（ピン留め）</span>
      </label>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-2xl bg-[#c4a484] py-4 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? "保存中..." : product ? "更新する" : "登録する"}
      </button>
    </form>
  );
}
