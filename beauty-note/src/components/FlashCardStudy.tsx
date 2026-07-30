"use client";

import { useState } from "react";
import { INGREDIENT_TAG_MAP } from "@/lib/ingredients";
import { STUDY_COMPLETE_MESSAGE } from "@/lib/ingredients";
import type { Product } from "@/lib/types";
import { IngredientBadgeList } from "./IngredientBadge";

export function FlashCardStudy({
  products,
  cheerMessage,
}: {
  products: Product[];
  cheerMessage: string;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [rememberedCount, setRememberedCount] = useState(0);
  const [done, setDone] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d9c8b8] bg-white p-8 text-center">
        <p className="text-sm text-[#6b6560]">
          ピン留め商品がありません。商品画面から「今日覚える」に追加してください。
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="animate-celebrate rounded-2xl border border-[#eadfd4] bg-white p-8 text-center shadow-sm">
        <p className="text-3xl">🌸</p>
        <h2 className="mt-3 text-xl font-bold text-[#2d2a26]">
          {STUDY_COMPLETE_MESSAGE}
        </h2>
        <p className="mt-2 text-sm text-[#6b6560]">
          今日 {rememberedCount}/{products.length} 商品を覚えたよ
        </p>
        {cheerMessage && (
          <p className="mt-4 rounded-xl bg-[#fff4ec] p-4 text-sm leading-relaxed text-[#4a4541]">
            {cheerMessage}
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setFlipped(false);
            setRememberedCount(0);
            setDone(false);
          }}
          className="mt-6 rounded-full bg-[#c4a484] px-6 py-3 text-sm font-semibold text-white"
        >
          もう一度復習する
        </button>
      </div>
    );
  }

  const product = products[index];
  const progress = `${index + 1} / ${products.length}`;

  async function handleAnswer(remembered: boolean) {
    await fetch("/api/study", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: product.id, remembered }),
    });

    if (remembered) {
      setRememberedCount((c) => c + 1);
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 400);
    }

    if (index + 1 >= products.length) {
      setDone(true);
      return;
    }

    setIndex((i) => i + 1);
    setFlipped(false);
  }

  const quizTag = product.ingredient_tags.find(
    (t) => INGREDIENT_TAG_MAP[t]?.tone === "positive"
  );
  const quizLabel = quizTag ? INGREDIENT_TAG_MAP[quizTag].label : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-[#6b6560]">
        <span>暗記モード</span>
        <span>{progress}</span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className={`min-h-[320px] w-full rounded-3xl border border-[#eadfd4] bg-white p-6 text-left shadow-md transition ${
          celebrate ? "animate-celebrate" : ""
        }`}
      >
        {!flipped ? (
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-[#a88668]">表</p>
              <p className="mt-2 text-sm text-[#6b6560]">{product.brand}</p>
              <h2 className="mt-1 text-2xl font-bold leading-snug text-[#2d2a26]">
                {product.name}
              </h2>
              {product.shade && (
                <p className="mt-2 text-base text-[#6b6560]">{product.shade}</p>
              )}
            </div>
            <p className="text-center text-sm text-[#a88668]">タップして答えを見る</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-medium text-[#a88668]">裏</p>
            <div>
              <p className="text-xs font-semibold text-[#6b6560]">主要成分</p>
              <p className="mt-1 text-base leading-relaxed">
                {product.key_ingredients.join(" / ") || "未登録"}
              </p>
            </div>
            <IngredientBadgeList tags={product.ingredient_tags} />
            {quizLabel && (
              <div className="rounded-xl bg-[#fff9f5] p-3">
                <p className="text-xs font-semibold text-[#6b6560]">成分クイズ</p>
                <p className="mt-1 text-sm">この商品は「{quizLabel}」です。</p>
              </div>
            )}
            {product.talking_points && (
              <p className="text-sm leading-relaxed text-[#4a4541]">
                {product.talking_points}
              </p>
            )}
          </div>
        )}
      </button>

      {flipped && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleAnswer(false)}
            className="rounded-2xl border border-[#eadfd4] bg-white py-4 text-sm font-semibold text-[#6b6560]"
          >
            まだ不安
          </button>
          <button
            type="button"
            onClick={() => handleAnswer(true)}
            className="rounded-2xl bg-[#c4a484] py-4 text-sm font-semibold text-white"
          >
            覚えた！
          </button>
        </div>
      )}
    </div>
  );
}
