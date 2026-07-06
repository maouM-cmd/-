import { findMiddleStation } from "./geo";
import { generateBoostContent } from "./boost";
import { generateVenueCandidates } from "./venue";
import {
  getEventDetail,
  getParticipantsByEventId,
  savePlan,
  verifyEditToken,
} from "./db";
import type { Plan } from "./types";

export async function generatePlan(slug: string, editToken: string): Promise<Plan | null> {
  const event = verifyEditToken(slug, editToken);
  if (!event) return null;

  const participants = getParticipantsByEventId(event.id);
  const stations = participants.map((p) => p.station);
  if (stations.length === 0) {
    stations.push("新宿");
  }

  const middleStation = await findMiddleStation(stations);
  const venues = generateVenueCandidates(middleStation, event.budget, event.mood);
  const boostContent = generateBoostContent(
    participants,
    event.date_options,
    event.mood,
    middleStation
  );

  return savePlan(event.id, middleStation, venues, boostContent);
}

export async function getPlanOrNull(slug: string): Promise<Plan | null> {
  const detail = getEventDetail(slug);
  return detail?.plan ?? null;
}
