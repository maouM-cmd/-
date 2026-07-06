import { absoluteAppUrl } from "./app-url";
import {
  getEventBySlug,
  getParticipantsByEventId,
  markAllAnsweredNotified,
  shouldNotifyAllAnswered,
} from "./db";
import { sendPushToEvent } from "./push";

export async function checkAndNotifyAllAnswered(slug: string) {
  const event = getEventBySlug(slug);
  if (!event) return;

  const participantCount = getParticipantsByEventId(event.id).length;
  if (!shouldNotifyAllAnswered(event, participantCount)) return;

  await sendPushToEvent(event.id, {
    title: `${event.title} — 全員回答済み`,
    body: "参加者が揃いました。プランを生成できます",
    url: absoluteAppUrl(`/e/${slug}?token=${event.edit_token}`),
  });

  markAllAnsweredNotified(event.id);
}
