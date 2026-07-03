"use client";

import { useState } from "react";

export function ConversationStarters({ starters }: { starters: string[] }) {
  const [copied, setCopied] = useState<number | null>(null);

  async function copy(text: string, index: number) {
    await navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  }

  if (!starters.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-gray-900">会話のきっかけ</h2>
        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
          競合優位機能
        </span>
      </div>
      <p className="text-xs text-gray-500">
        共通点から自動生成。マッチ後の「何を話す？」を解消します。
      </p>
      {starters.map((text, i) => (
        <div
          key={i}
          className="flex items-start justify-between gap-3 rounded-xl border border-violet-100 bg-violet-50/50 p-3"
        >
          <p className="text-sm text-gray-700">{text}</p>
          <button
            type="button"
            onClick={() => copy(text, i)}
            className="shrink-0 rounded-lg bg-white px-2 py-1 text-xs font-medium text-violet-600 shadow-sm hover:bg-violet-100"
          >
            {copied === i ? "コピー済" : "コピー"}
          </button>
        </div>
      ))}
    </div>
  );
}
