import { scoreToRank } from "./constants";
import type { LLMEvaluationResult } from "./types";

const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export function isLlmEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function evaluatePromptWithLLM(
  challengeDescription: string,
  promptText: string,
): Promise<LLMEvaluationResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const systemPrompt = `あなたはプロンプトエンジニアリングの専門家です。
課題に対するユーザーのプロンプトを評価し、必ず以下のJSON形式のみで回答してください:
{"score":0-100の整数,"feedback":"総合フィードバック（日本語100字程度）","improvements":["改善点1","改善点2","改善点3"]}
評価基準: 課題への適合度、指示の明確さ、具体性、出力形式の指定、制約の明示`;

  const userPrompt = `【課題】\n${challengeDescription}\n\n【ユーザーのプロンプト】\n${promptText}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    console.error("LLM API error:", await res.text());
    return null;
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    const parsed = JSON.parse(content) as LLMEvaluationResult;
    parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)));
    if (!Array.isArray(parsed.improvements)) parsed.improvements = [];
    return parsed;
  } catch {
    return null;
  }
}

export function llmScoreToRank(score: number): string {
  return scoreToRank(score);
}
