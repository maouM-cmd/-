"use client";

import { useRef } from "react";
import { CreateSetDialog } from "@/components/CreateSetDialog";
import { SetCard } from "@/components/SetCard";
import { useAppData } from "@/hooks/useAppData";
import {
  createBlankSet,
  createSetFromTemplate,
  exportData,
  importData,
} from "@/lib/storage";
import type { Category } from "@/lib/types";

export default function HomePage() {
  const { data, save } = useAppData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleCreateFromTemplate(category: Category, name: string) {
    save(createSetFromTemplate(data, category, name));
  }

  function handleCreateBlank(name: string) {
    save(createBlankSet(data, name));
  }

  function handleExport() {
    const blob = new Blob([exportData(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `interview-cue-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = importData(String(reader.result));
        if (
          confirm(
            "インポートすると現在のデータが上書きされます。続行しますか？",
          )
        ) {
          save(imported);
        }
      } catch {
        alert("インポートに失敗しました。JSONファイルを確認してください。");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <section className="rounded-2xl bg-gradient-to-br from-sky-600 to-sky-800 p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">就活・転職 面接対策</h2>
        <p className="mt-2 text-sm leading-relaxed text-sky-100">
          質問ごとに要点と全文を登録し、練習モードで声に出して反復。
          面接直前はクイック参照で最終確認できます。
        </p>
      </section>

      <div className="mt-6">
        <CreateSetDialog
          onCreateFromTemplate={handleCreateFromTemplate}
          onCreateBlank={handleCreateBlank}
        />
      </div>

      {data.sets.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-500">
          まだ原稿セットがありません。上のボタンから作成してください。
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">保存済みセット</h3>
          {data.sets.map((set) => (
            <SetCard key={set.id} set={set} />
          ))}
        </div>
      )}

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-700">データのバックアップ</h3>
        <p className="mt-1 text-xs text-slate-500">
          ブラウザの localStorage に保存されます。機種変更時はエクスポートしてください。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
          >
            JSON エクスポート
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
          >
            JSON インポート
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </section>
    </div>
  );
}
