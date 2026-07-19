"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useAppData } from "@/hooks/useAppData";
import { updateItem } from "@/lib/storage";
import type { ScriptItem } from "@/lib/types";

interface EditItemFormProps {
  setId: string;
  setName: string;
  initialItem: ScriptItem;
}

function EditItemForm({ setId, setName, initialItem }: EditItemFormProps) {
  const router = useRouter();
  const { data, save } = useAppData();
  const [item, setItem] = useState(initialItem);

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    save(updateItem(data, setId, item));
    router.push(`/sets/${setId}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href={`/sets/${setId}`}
        className="text-sm text-sky-600 hover:underline"
      >
        ← 一覧に戻る
      </Link>

      <h2 className="mt-4 text-2xl font-bold text-slate-900">原稿を編集</h2>
      <p className="mt-1 text-sm text-slate-500">{setName}</p>

      <form onSubmit={handleSave} className="mt-6 space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">質問</span>
          <input
            value={item.question}
            onChange={(event) =>
              setItem({ ...item, question: event.target.value })
            }
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-sky-500 focus:ring-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            要点（キーワード・箇条書き）
          </span>
          <textarea
            value={item.keyPoints}
            onChange={(event) =>
              setItem({ ...item, keyPoints: event.target.value })
            }
            rows={5}
            placeholder="・結論から話す&#10;・具体例: 〇〇プロジェクト&#10;・数字: 売上20%向上"
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-sky-500 focus:ring-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">回答全文</span>
          <textarea
            value={item.fullText}
            onChange={(event) =>
              setItem({ ...item, fullText: event.target.value })
            }
            rows={10}
            placeholder="最初は全文で覚え、慣れたら要点だけで話せるようにしましょう。"
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-sky-500 focus:ring-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            目安時間（秒）
          </span>
          <input
            type="number"
            min={10}
            max={600}
            value={item.targetSeconds}
            onChange={(event) =>
              setItem({
                ...item,
                targetSeconds: Number(event.target.value) || 60,
              })
            }
            className="mt-1 w-32 rounded-xl border border-slate-300 px-3 py-2 outline-none ring-sky-500 focus:ring-2"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white hover:bg-sky-700"
        >
          保存する
        </button>
      </form>
    </div>
  );
}

export default function EditItemPage() {
  const params = useParams<{ setId: string; itemId: string }>();
  const { data } = useAppData();

  const set = data.sets.find((entry) => entry.id === params.setId);
  const item = set?.items.find((entry) => entry.id === params.itemId);

  if (!set || !item) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-slate-600">質問が見つかりません</p>
        <Link href={`/sets/${params.setId}`} className="mt-4 inline-block text-sky-600">
          一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <EditItemForm
      key={item.id}
      setId={set.id}
      setName={set.name}
      initialItem={item}
    />
  );
}
