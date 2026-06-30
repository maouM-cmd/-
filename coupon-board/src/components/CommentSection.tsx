"use client";

import { useEffect, useState } from "react";
import type { Comment } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CommentSection({ dealId }: { dealId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/deals/${dealId}/comments`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {});
  }, [dealId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/deals/${dealId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, author_name: authorName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "投稿に失敗しました");
        return;
      }

      setComments((prev) => [...prev, data]);
      setBody("");
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 border-t border-gray-100 pt-6">
      <h2 className="mb-4 text-lg font-bold text-gray-900">
        コメント ({comments.length})
      </h2>

      {comments.length === 0 ? (
        <p className="mb-4 text-sm text-gray-500">
          まだコメントはありません。使った感想を共有しましょう。
        </p>
      ) : (
        <ul className="mb-6 space-y-3">
          {comments.map((c) => (
            <li
              key={c.id}
              className="rounded-xl bg-gray-50 px-4 py-3"
            >
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-medium text-gray-700">{c.author_name}</span>
                <span>{formatDate(c.created_at)}</span>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                {c.body}
              </p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <textarea
          rows={3}
          placeholder="使ってみた感想、補足情報など"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="ニックネーム（任意）"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400"
          />
          <button
            type="submit"
            disabled={loading || !body.trim()}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {loading ? "..." : "投稿"}
          </button>
        </div>
      </form>
    </section>
  );
}
