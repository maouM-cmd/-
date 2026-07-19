"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import { DisplayModeToggle } from "@/components/DisplayModeToggle";
import { PracticeTimer } from "@/components/PracticeTimer";
import { useAppData } from "@/hooks/useAppData";
import type { DisplayMode } from "@/lib/types";

export default function PracticePage() {
  const params = useParams<{ setId: string }>();
  const { data } = useAppData();
  const [index, setIndex] = useState(0);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("keypoints");
  const [running, setRunning] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const set = data?.sets.find((entry) => entry.id === params.setId);
  const items = set ? [...set.items].sort((a, b) => a.order - b.order) : [];
  const item = items[index];

  const handleElapsed = useCallback(() => {
    setRunning(false);
  }, []);

  if (!set || items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-slate-600">練習する質問がありません</p>
        <Link href={`/sets/${params.setId}`} className="mt-4 inline-block text-sky-600">
          一覧に戻る
        </Link>
      </div>
    );
  }

  const answerText =
    displayMode === "keypoints" ? item.keyPoints : item.fullText;
  const hasAnswer = answerText.trim().length > 0;

  function goNext() {
    setRunning(false);
    setShowAnswer(false);
    setTimerKey((current) => current + 1);
    setIndex((current) => (current + 1) % items.length);
  }

  function goPrev() {
    setRunning(false);
    setShowAnswer(false);
    setTimerKey((current) => current + 1);
    setIndex((current) => (current - 1 + items.length) % items.length);
  }

  function restart() {
    setRunning(false);
    setShowAnswer(false);
    setTimerKey((current) => current + 1);
  }

  return (
    <div className="min-h-[calc(100vh-57px)] bg-slate-900 text-white">
      <div className="mx-auto flex max-w-3xl flex-col px-4 py-6">
        <div className="flex items-center justify-between">
          <Link
            href={`/sets/${set.id}`}
            className="text-sm text-sky-300 hover:underline"
          >
            ← 終了
          </Link>
          <span className="text-sm text-slate-400">
            {index + 1} / {items.length}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <DisplayModeToggle mode={displayMode} onChange={setDisplayMode} />
          <p className="text-xs text-slate-400">{set.name}</p>
        </div>

        <section className="mt-8 flex flex-1 flex-col">
          <p className="text-xs font-medium uppercase tracking-wider text-sky-300">
            質問
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">
            {item.question}
          </h2>

          <div className="mt-8">
            <PracticeTimer
              key={`${item.id}-${timerKey}`}
              targetSeconds={item.targetSeconds}
              running={running}
              onElapsed={handleElapsed}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {!running ? (
              <button
                type="button"
                onClick={() => setRunning(true)}
                className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white"
              >
                タイマー開始
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setRunning(false)}
                className="rounded-xl bg-slate-600 px-5 py-3 text-sm font-semibold text-white"
              >
                一時停止
              </button>
            )}
            <button
              type="button"
              onClick={restart}
              className="rounded-xl bg-slate-700 px-5 py-3 text-sm font-semibold text-white"
            >
              リセット
            </button>
            <button
              type="button"
              onClick={() => setShowAnswer((current) => !current)}
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
            >
              {showAnswer ? "回答を隠す" : "回答を見る"}
            </button>
          </div>

          {showAnswer && (
            <div className="mt-6 rounded-2xl bg-slate-800 p-5">
              <p className="text-xs text-slate-400">
                {displayMode === "keypoints" ? "要点" : "全文"}
              </p>
              {hasAnswer ? (
                <p className="mt-2 whitespace-pre-wrap text-lg leading-relaxed text-slate-100">
                  {answerText}
                </p>
              ) : (
                <p className="mt-2 text-slate-400">
                  まだ回答が登録されていません。
                  <Link
                    href={`/sets/${set.id}/edit/${item.id}`}
                    className="ml-1 text-sky-300 underline"
                  >
                    編集する
                  </Link>
                </p>
              )}
            </div>
          )}
        </section>

        <div className="mt-8 grid grid-cols-2 gap-3 pb-6">
          <button
            type="button"
            onClick={goPrev}
            className="rounded-2xl bg-slate-700 py-4 text-sm font-semibold"
          >
            前の質問
          </button>
          <button
            type="button"
            onClick={goNext}
            className="rounded-2xl bg-sky-600 py-4 text-sm font-semibold"
          >
            次の質問
          </button>
        </div>
      </div>
    </div>
  );
}
