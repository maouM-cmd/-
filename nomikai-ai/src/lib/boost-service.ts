import { generateBoostContent as generateBoostContentRuleBased } from "./boost";
import {
  generateBoostContentAnthropic,
  isAnthropicBoostEnabled,
} from "./boost-anthropic";
import { generateBoostContentLlm, isLlmBoostEnabled } from "./boost-llm";
import type { BoostContent, ContentSource, DateOption, Event, Mood, Participant } from "./types";

export async function generateBoostContent(
  event: Event,
  participants: Participant[],
  dateOptions: DateOption[],
  mood: Mood,
  middleStation: string
): Promise<{ content: BoostContent; source: ContentSource }> {
  if (isLlmBoostEnabled()) {
    const llm = await generateBoostContentLlm(
      event,
      participants,
      dateOptions,
      mood,
      middleStation
    );
    if (llm) return { content: llm, source: "llm" };
  }

  if (isAnthropicBoostEnabled()) {
    const anthropic = await generateBoostContentAnthropic(
      event,
      participants,
      dateOptions,
      mood,
      middleStation
    );
    if (anthropic) return { content: anthropic, source: "anthropic" };
  }

  return {
    content: generateBoostContentRuleBased(
      participants,
      dateOptions,
      mood,
      middleStation
    ),
    source: "template",
  };
}
