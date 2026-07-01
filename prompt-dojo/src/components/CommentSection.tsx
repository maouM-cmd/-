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

export function CommentSection({ submissionId }: { submissionId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/submissions/${submissionId}/comments`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {});
  }, [submissionId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setLoading(true);
    setError("");

    const res = await fetch(`/api/submissions/${submissionId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "投稿に失敗しました");
      return;
    }

    setComments((prev) => [...prev, data]);
    setBody("");
  }

  return (
    <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-bold text-gray-900">
        コメント ({comments.length})
      </h2>

      {comments.length === 0 ? (
        <p className="mb-4 text-sm text-gray-500">まだコメントがありません</p>
      ) : (
        <ul className="mb-6 space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="rounded-lg bg-gray-50 p-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-medium text-gray-700">{c.author_name}</span>
                <span>{formatDate(c.created_at)}</span>
              </div>
              <p className="mt-1 text-sm text-gray-800">{c.body}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="フィードバックやアドバイスを書く..."
          maxLength={1000}
          className="w-full rounded-lg border border-indigo-200 px-3 py-2 text-sm"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading || !body.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {loading ? "投稿中..." : "コメントする"}
        </button>
      </form>
    </section>
  );
}
