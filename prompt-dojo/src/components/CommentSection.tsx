"use client";

import { useCallback, useEffect, useState } from "react";
import { MAX_COMMENT_DEPTH } from "@/lib/constants";
import type { Comment } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function countAll(comments: Comment[]): number {
  return comments.reduce(
    (n, c) => n + 1 + (c.replies ? countAll(c.replies) : 0),
    0,
  );
}

function CommentItem({
  comment,
  submissionId,
  depth,
  onReply,
}: {
  comment: Comment;
  submissionId: number;
  depth: number;
  onReply: () => void;
}) {
  const [replying, setReplying] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canReply = depth < MAX_COMMENT_DEPTH;

  async function submitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyBody.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch(`/api/submissions/${submissionId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: replyBody, parent_id: comment.id }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "返信に失敗しました");
      return;
    }

    onReply();
    setReplyBody("");
    setReplying(false);
  }

  return (
    <li className={`rounded-lg p-3 ${depth === 1 ? "bg-gray-50" : "bg-white"}`}>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="font-medium text-gray-700">{comment.author_name}</span>
        <span>{formatDate(comment.created_at)}</span>
      </div>
      <p className="mt-1 text-sm text-gray-800">{comment.body}</p>
      {canReply && (
        <button
          type="button"
          onClick={() => setReplying(!replying)}
          className="mt-2 text-xs text-indigo-600 hover:underline"
        >
          返信
        </button>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <ul
          className="mt-3 space-y-2 border-l-2 border-indigo-100 pl-3"
          style={{ marginLeft: Math.min(depth * 8, 32) }}
        >
          {comment.replies.map((r) => (
            <CommentItem
              key={r.id}
              comment={r}
              submissionId={submissionId}
              depth={depth + 1}
              onReply={onReply}
            />
          ))}
        </ul>
      )}

      {replying && (
        <form onSubmit={submitReply} className="mt-3 space-y-2">
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            rows={2}
            placeholder="返信を書く..."
            maxLength={1000}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading || !replyBody.trim()}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white disabled:opacity-50"
          >
            {loading ? "送信中..." : "返信する"}
          </button>
        </form>
      )}
    </li>
  );
}

export function CommentSection({ submissionId }: { submissionId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshComments = useCallback(() => {
    fetch(`/api/submissions/${submissionId}/comments`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {});
  }, [submissionId]);

  useEffect(() => {
    refreshComments();
  }, [refreshComments]);

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

    refreshComments();
    setBody("");
  }

  return (
    <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-bold text-gray-900">
        コメント ({countAll(comments)})
      </h2>

      {comments.length === 0 ? (
        <p className="mb-4 text-sm text-gray-500">まだコメントがありません</p>
      ) : (
        <ul className="mb-6 space-y-3">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              submissionId={submissionId}
              depth={1}
              onReply={refreshComments}
            />
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
