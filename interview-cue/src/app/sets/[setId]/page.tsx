"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppData } from "@/hooks/useAppData";
import {
  addItem,
  deleteItem,
  deleteSet,
  duplicateSet,
  updateSet,
} from "@/lib/storage";
import { CATEGORY_LABELS, formatSeconds, getCompletionStatus } from "@/lib/utils";

export default function SetDetailPage() {
  const params = useParams<{ setId: string }>();
  const router = useRouter();
  const { data, save } = useAppData();
  const [newQuestion, setNewQuestion] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [setName, setSetName] = useState("");

  const set = data.sets.find((entry) => entry.id === params.setId);

  if (!set) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-slate-600">セットが見つかりません</p>
        <Link href="/" className="mt-4 inline-block text-sky-600">
          ホームに戻る
        </Link>
      </div>
    );
  }

  function startRename() {
    setSetName(set!.name);
    setEditingName(true);
  }

  function saveRename() {
    if (!setName.trim()) return;
    save(updateSet(data, { ...set!, name: setName.trim() }));
    setEditingName(false);
  }

  function handleAddQuestion(event: React.FormEvent) {
    event.preventDefault();
    if (!newQuestion.trim()) return;
    save(addItem(data, set!.id, newQuestion.trim()));
    setNewQuestion("");
  }

  function handleDeleteSet() {
    if (!confirm(`「${set!.name}」を削除しますか？`)) return;
    save(deleteSet(data, set!.id));
    router.push("/");
  }

  function handleDuplicate() {
    save(duplicateSet(data, set!.id));
  }

  const sortedItems = [...set.items].sort((a, b) => a.order - b.order);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-sm text-sky-600 hover:underline">
        ← ホーム
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-medium text-sky-700">
            {CATEGORY_LABELS[set.category]}
          </p>
          {editingName ? (
            <div className="mt-1 flex gap-2">
              <input
                value={setName}
                onChange={(event) => setSetName(event.target.value)}
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-lg font-semibold outline-none ring-sky-500 focus:ring-2"
              />
              <button
                type="button"
                onClick={saveRename}
                className="rounded-xl bg-sky-600 px-3 py-2 text-sm text-white"
              >
                保存
              </button>
            </div>
          ) : (
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{set.name}</h2>
          )}
        </div>
        <button
          type="button"
          onClick={startRename}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          名前を変更
        </button>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Link
          href={`/sets/${set.id}/practice`}
          className="rounded-2xl bg-sky-600 px-4 py-4 text-center font-semibold text-white shadow-sm transition hover:bg-sky-700"
        >
          練習モード
        </Link>
        <Link
          href={`/sets/${set.id}/reference`}
          className="rounded-2xl bg-slate-800 px-4 py-4 text-center font-semibold text-white shadow-sm transition hover:bg-slate-900"
        >
          クイック参照
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleDuplicate}
          className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700"
        >
          複製
        </button>
        <button
          type="button"
          onClick={handleDeleteSet}
          className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700"
        >
          セット削除
        </button>
      </div>

      <section className="mt-8">
        <h3 className="text-sm font-semibold text-slate-700">質問一覧</h3>
        <div className="mt-3 space-y-2">
          {sortedItems.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{item.question}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <StatusBadge status={getCompletionStatus(item)} />
                  <span className="text-xs text-slate-500">
                    目安 {formatSeconds(item.targetSeconds)}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/sets/${set.id}/edit/${item.id}`}
                  className="rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700"
                >
                  編集
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("この質問を削除しますか？")) {
                      save(deleteItem(data, set.id, item.id));
                    }
                  }}
                  className="rounded-lg px-2 py-1.5 text-sm text-rose-600"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={handleAddQuestion} className="mt-6 flex gap-2">
        <input
          value={newQuestion}
          onChange={(event) => setNewQuestion(event.target.value)}
          placeholder="カスタム質問を追加"
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2"
        />
        <button
          type="submit"
          disabled={!newQuestion.trim()}
          className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          追加
        </button>
      </form>
    </div>
  );
}
