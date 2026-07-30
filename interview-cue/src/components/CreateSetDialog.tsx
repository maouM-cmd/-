"use client";

import { useState } from "react";
import type { Category } from "@/lib/types";

interface CreateSetDialogProps {
  onCreateFromTemplate: (category: Category, name: string) => void;
  onCreateBlank: (name: string) => void;
}

export function CreateSetDialog({
  onCreateFromTemplate,
  onCreateBlank,
}: CreateSetDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"template" | "blank">("template");
  const [category, setCategory] = useState<Category>("job_hunting");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;

    if (mode === "template") {
      onCreateFromTemplate(category, name.trim());
    } else {
      onCreateBlank(name.trim());
    }

    setName("");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50 px-4 py-5 text-sm font-semibold text-sky-800 transition hover:bg-sky-100"
      >
        + 新しい原稿セットを作成
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h3 className="text-base font-semibold text-slate-900">セット作成</h3>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("template")}
          className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium ${
            mode === "template"
              ? "bg-sky-600 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          テンプレート
        </button>
        <button
          type="button"
          onClick={() => setMode("blank")}
          className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium ${
            mode === "blank"
              ? "bg-sky-600 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          空のセット
        </button>
      </div>

      {mode === "template" && (
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setCategory("job_hunting");
              setName("就活 標準セット");
            }}
            className={`flex-1 rounded-xl px-3 py-2 text-sm ${
              category === "job_hunting"
                ? "bg-emerald-100 text-emerald-800 ring-2 ring-emerald-400"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            就活
          </button>
          <button
            type="button"
            onClick={() => {
              setCategory("career_change");
              setName("転職 標準セット");
            }}
            className={`flex-1 rounded-xl px-3 py-2 text-sm ${
              category === "career_change"
                ? "bg-emerald-100 text-emerald-800 ring-2 ring-emerald-400"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            転職
          </button>
        </div>
      )}

      <label className="mt-4 block text-sm font-medium text-slate-700">
        セット名（企業名など）
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="例: A社 1次面接"
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2"
        />
      </label>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex-1 rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          作成
        </button>
      </div>
    </form>
  );
}
