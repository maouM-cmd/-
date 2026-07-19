"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MAX_COMMENT_DEPTH } from "@/lib/constants";
import { mapApiError } from "@/lib/map-api-error";
import { enqueue } from "@/lib/offline-queue";
import { useOfflineSync } from "@/components/OfflineSyncProvider";
import type { Comment } from "@/lib/types";

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === "en" ? "en-US" : "ja-JP", {
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
  locale,
  onReply,
}: {
  comment: Comment;
  submissionId: number;
  depth: number;
  locale: string;
  onReply: () => void;
}) {
  const t = useTranslations();
  const tc = useTranslations("comment");
  const { refresh } = useOfflineSync();
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

    if (!navigator.onLine) {
      await enqueue({
        type: "comment",
        submissionId,
        body: replyBody,
        parentId: comment.id,
      });
      await refresh();
      setLoading(false);
      onReply();
      setReplyBody("");
      setReplying(false);
      return;
    }

    const res = await fetch(`/api/submissions/${submissionId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: replyBody, parent_id: comment.id }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(mapApiError(data, t));
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
        <span>{formatDate(comment.created_at, locale)}</span>
      </div>
      <p className="mt-1 text-sm text-gray-800">{comment.body}</p>
      {canReply && (
        <button
          type="button"
          onClick={() => setReplying(!replying)}
          className="mt-2 text-xs text-indigo-600 hover:underline"
        >
          {tc("reply")}
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
              locale={locale}
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
            placeholder={tc("replyPlaceholder")}
            maxLength={1000}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading || !replyBody.trim()}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white disabled:opacity-50"
          >
            {loading ? tc("sending") : tc("replySubmit")}
          </button>
        </form>
      )}
    </li>
  );
}

export function CommentSection({ submissionId }: { submissionId: number }) {
  const locale = useLocale();
  const t = useTranslations();
  const tc = useTranslations("comment");
  const { refresh } = useOfflineSync();
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [queued, setQueued] = useState(false);

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
    setError("");
    setQueued(false);

    if (!navigator.onLine) {
      await enqueue({ type: "comment", submissionId, body });
      await refresh();
      setQueued(true);
      setBody("");
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/submissions/${submissionId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(mapApiError(data, t));
      return;
    }

    refreshComments();
    setBody("");
  }

  return (
    <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-bold text-gray-900">
        {tc("title")} ({countAll(comments)})
      </h2>

      {comments.length === 0 ? (
        <p className="mb-4 text-sm text-gray-500">{tc("empty")}</p>
      ) : (
        <ul className="mb-6 space-y-3">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              submissionId={submissionId}
              depth={1}
              locale={locale}
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
          placeholder={tc("placeholder")}
          maxLength={1000}
          className="w-full rounded-lg border border-indigo-200 px-3 py-2 text-sm"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        {queued && <p className="text-xs text-amber-700">{tc("queued")}</p>}
        <button
          type="submit"
          disabled={loading || !body.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {loading ? tc("posting") : tc("submit")}
        </button>
      </form>
    </section>
  );
}
