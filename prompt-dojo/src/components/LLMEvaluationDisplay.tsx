import type { LLMEvaluationResult } from "@/lib/types";
import { RANK_BG, scoreToRank } from "@/lib/constants";

export function LLMEvaluationDisplay({
  llmScore,
  llmFeedbackJson,
}: {
  llmScore: number | null;
  llmFeedbackJson: string | null;
}) {
  if (llmScore === null || !llmFeedbackJson) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
        LLM評価は未実施です（APIキー未設定、または日次上限に達しています）
      </div>
    );
  }

  const evaluation = JSON.parse(llmFeedbackJson) as LLMEvaluationResult;
  const rank = scoreToRank(llmScore);

  return (
    <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
      <div className="flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-lg font-bold ${RANK_BG[rank]}`}>
          AI {rank}
        </span>
        <p className="font-medium">LLMスコア: {llmScore}点</p>
      </div>
      <p className="mt-3 text-sm text-gray-700">{evaluation.feedback}</p>
      {evaluation.improvements.length > 0 && (
        <ul className="mt-3 space-y-1">
          {evaluation.improvements.map((item) => (
            <li key={item} className="text-sm text-gray-600">
              • {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
