"use client";

import { useState } from "react";

export function CopyCard({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-amber-100 bg-amber-50/50 p-3">
      <div>
        {label && <p className="mb-1 text-xs font-medium text-amber-700">{label}</p>}
        <p className="text-sm text-gray-700">{text}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 min-h-[44px] rounded-lg bg-white px-3 py-2 text-xs font-medium text-amber-600 shadow-sm hover:bg-amber-100"
      >
        {copied ? "コピー済" : "コピー"}
      </button>
    </div>
  );
}

export function CopyList({
  title,
  items,
  emoji,
}: {
  title: string;
  items: string[];
  emoji?: string;
}) {
  if (!items.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-gray-900">
        {emoji && <span className="mr-1">{emoji}</span>}
        {title}
      </h3>
      {items.map((text, i) => (
        <CopyCard key={i} text={text} />
      ))}
    </div>
  );
}
