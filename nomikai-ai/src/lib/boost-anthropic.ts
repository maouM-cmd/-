import { MOOD_OPTIONS } from "./constants";
import { findBestSlot } from "./boost";
import type { BoostContent, DateOption, Event, Mood, Participant } from "./types";

interface LlmBoostResponse {
  toasts?: string[];
  games?: string[];
  conversationStarters?: string[];
  afterParty?: string;
}

function buildBoostPrompt(
  event: Event,
  participants: Participant[],
  dateOptions: DateOption[],
  mood: Mood,
  middleStation: string,
  recommendedSlot: BoostContent["recommendedSlot"]
): string {
  const moodLabel = MOOD_OPTIONS.find((m) => m.value === mood)?.label ?? mood;
  const names = participants.map((p) => `${p.name}（${p.station}）`).join("、");

  return `あなたは飲み会の盛り上げ役AIです。以下の情報から、日本語で盛り上げプランをJSON形式で生成してください。

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
}

function parseBoostResponse(
  content: string,
  recommendedSlot: BoostContent["recommendedSlot"],
  middleStation: string
): BoostContent | null {
  try {
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

export function isAnthropicBoostEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function generateBoostContentAnthropic(
  event: Event,
  participants: Participant[],
  dateOptions: DateOption[],
  mood: Mood,
  middleStation: string
): Promise<BoostContent | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const recommendedSlot = findBestSlot(participants, dateOptions);
  const prompt = buildBoostPrompt(
    event,
    participants,
    dateOptions,
    mood,
    middleStation,
    recommendedSlot
  );

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text = data.content?.find((c) => c.type === "text")?.text;
    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return parseBoostResponse(jsonMatch[0], recommendedSlot, middleStation);
  } catch {
    return null;
  }
}
