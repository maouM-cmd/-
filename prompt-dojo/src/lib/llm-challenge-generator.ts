import type { GeneratedChallenge } from "./types";

const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export function isChallengeGenEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function generateChallengeWithLLM(
  theme: string,
  difficulty: "beginner" | "intermediate" | "advanced" = "intermediate",
): Promise<GeneratedChallenge | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const systemPrompt = `あなたはプロンプトエンジニアリングの教材作成者です。
テーマと難易度に基づき、プロンプト練習用の課題を1つ作成してください。
必ず以下のJSON形式のみで回答:
{"title":"課題タイトル（50字以内）","description":"挑戦者への説明（200字程度）","sample_output":"期待する出力例（100字程度）"}`;

  const userPrompt = `テーマ: ${theme}\n難易度: ${difficulty}`;

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
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    console.error("LLM challenge gen error:", await res.text());
    return null;
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    return JSON.parse(content) as GeneratedChallenge;
  } catch {
    return null;
  }
}
