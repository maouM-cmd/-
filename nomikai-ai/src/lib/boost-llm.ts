import { MOOD_OPTIONS } from "./constants";
import { findBestSlot } from "./boost";
import type { BoostContent, DateOption, Event, Mood, Participant } from "./types";

interface LlmBoostResponse {
  toasts?: string[];
  games?: string[];
  conversationStarters?: string[];
  afterParty?: string;
}

export function isLlmBoostEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function generateBoostContentLlm(
  event: Event,
  participants: Participant[],
  dateOptions: DateOption[],
  mood: Mood,
  middleStation: string
): Promise<BoostContent | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const moodLabel = MOOD_OPTIONS.find((m) => m.value === mood)?.label ?? mood;
  const names = participants.map((p) => `${p.name}（${p.station}）`).join("、");
  const recommendedSlot = findBestSlot(participants, dateOptions);

  const prompt = `あなたは飲み会の盛り上げ役AIです。以下の情報から、日本語で盛り上げプランをJSON形式で生成してください。

飲み会名: ${event.title}
幹事: ${event.organizer_name}
雰囲気: ${moodLabel}
予算: 1人あたり${event.budget}円程度
参加者(${participants.length}人): ${names || "未定"}
集合予定: ${middleStation}
おすすめ日時: ${recommendedSlot?.label ?? "未定"}

以下のJSON形式のみで返答（他のテキストは不要）:
{
  "toasts": ["乾杯の挨拶1", "乾杯の挨拶2", "乾杯の挨拶3"],
  "games": ["盛り上げゲーム1", "盛り上げゲーム2"],
  "conversationStarters": ["会話のきっかけ1", "会話のきっかけ2", "会話のきっかけ3"],
  "afterParty": "2次会の提案（1文）"
}`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages: [
          { role: "system", content: "飲み会の盛り上げ役。必ず有効なJSONのみを返す。" },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
      }),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content) as LlmBoostResponse;
    if (!parsed.toasts?.length || !parsed.games?.length) return null;

    return {
      recommendedSlot,
      toasts: parsed.toasts.slice(0, 3),
      games: parsed.games.slice(0, 3),
      conversationStarters: (parsed.conversationStarters ?? []).slice(0, 3),
      afterParty: parsed.afterParty ?? `${middleStation}周辺で2次会を検討しましょう`,
    };
  } catch {
    return null;
  }
}
