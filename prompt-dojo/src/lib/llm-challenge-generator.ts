import type { GeneratedChallenge } from "./types";

const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

type Locale = "ja" | "en";

const PROMPTS = {
  ja: {
    system: `あなたはプロンプトエンジニアリングの教材作成者です。
テーマと難易度に基づき、プロンプト練習用の課題を1つ作成してください。
必ず以下のJSON形式のみで回答:
{"title":"課題タイトル（50字以内）","description":"挑戦者への説明（200字程度）","sample_output":"期待する出力例（100字程度）","suggested_category_slug":"business|creative|coding|general のいずれか"}`,
    theme: "テーマ",
    difficulty: "難易度",
  },
  en: {
    system: `You create prompt-engineering practice challenges.
Create one challenge based on theme and difficulty. Respond ONLY with JSON:
{"title":"title (max 50 chars)","description":"instructions (~200 chars)","sample_output":"expected output (~100 chars)","suggested_category_slug":"business|creative|coding|general"}`,
    theme: "Theme",
    difficulty: "Difficulty",
  },
};

export function isChallengeGenEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function generateChallengeWithLLM(
  theme: string,
  difficulty: "beginner" | "intermediate" | "advanced" = "intermediate",
  locale: Locale = "ja",
): Promise<GeneratedChallenge | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const p = PROMPTS[locale];
  const userPrompt = `${p.theme}: ${theme}\n${p.difficulty}: ${difficulty}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: p.system },
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
