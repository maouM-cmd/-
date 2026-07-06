import { generateBoostContent as generateBoostContentRuleBased } from "./boost";
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
