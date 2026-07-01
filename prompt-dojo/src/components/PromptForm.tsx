"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RANK_BG, RANK_COLORS } from "@/lib/constants";
import type { EvaluationResult } from "@/lib/types";

export function PromptForm({ challengeId }: { challengeId: number }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const evaluate = useCallback(async (promptText: string) => {
    if (!promptText.trim()) {
      setEvaluation(null);
      return;
    }
    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt_text: promptText }),
    });
    if (res.ok) {
      setEvaluation(await res.json());
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => evaluate(text), 500);
    return () => clearTimeout(timer);
  }, [text, evaluate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch(`/api/challenges/${challengeId}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt_text: text }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "投稿に失敗しました");
      return;
    }
    router.push(`/submissions/${data.submission.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          あなたのプロンプト
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="課題に対するプロンプトを入力してください..."
          className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm leading-relaxed focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <p className="mt-1 text-xs text-gray-400">{text.length} / 5000文字</p>
      </div>

      {evaluation && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
          <div className="flex items-center gap-3">
            <span
              className={`text-2xl font-bold ${RANK_COLORS[evaluation.rank]}`}
            >
              {evaluation.rank}
            </span>
            <div>
              <p className="font-medium text-gray-900">
                自動スコア: {evaluation.score}点
              </p>
              <p className="text-xs text-gray-500">構造チェックによる参考値</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            {evaluation.checks.map((check) => (
              <li key={check.label} className="text-sm">
                <span
                  className={
                    check.passed ? "text-emerald-600" : "text-gray-400"
                  }
                >
                  {check.passed ? "✓" : "○"}
                </span>{" "}
                <span className="font-medium">{check.label}</span>
                <span className="text-gray-400">
                  {" "}
                  ({check.points}/{check.maxPoints})
                </span>
                {!check.passed && (
                  <p className="ml-5 text-xs text-gray-500">{check.tip}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting || text.trim().length < 10}
        className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 py-3 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-cyan-600 disabled:opacity-50"
      >
        {submitting ? "投稿中..." : "投稿する"}
      </button>
    </form>
  );
}

export function EvaluationDisplay({
  evaluation,
}: {
  evaluation: EvaluationResult;
}) {
  return (
    <div className="rounded-xl border border-indigo-100 bg-white p-4">
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-lg font-bold ${RANK_BG[evaluation.rank]}`}
        >
          {evaluation.rank}
        </span>
        <p className="font-medium">自動スコア: {evaluation.score}点</p>
      </div>
      <ul className="mt-4 space-y-2">
        {evaluation.checks.map((check) => (
          <li key={check.label} className="text-sm text-gray-700">
            <span className={check.passed ? "text-emerald-600" : "text-gray-400"}>
              {check.passed ? "✓" : "○"}
            </span>{" "}
            {check.label} ({check.points}/{check.maxPoints})
          </li>
        ))}
      </ul>
    </div>
  );
}
