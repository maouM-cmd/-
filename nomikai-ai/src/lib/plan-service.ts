import { generateBoostContent } from "./boost-service";
import { findMiddlePoint } from "./geo";
import { generateVenueCandidates } from "./venue-service";
import {
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

  const middle = await findMiddlePoint(stations);
  const { venues, source: venuesSource } = await generateVenueCandidates(
    middle.station,
    event.budget,
    event.mood,
    middle.lat,
    middle.lng
  );
  const { content: boostContent, source: boostSource } = await generateBoostContent(
    event,
    participants,
    event.date_options,
    event.mood,
    middle.station
  );

  return savePlan(event.id, middle.station, middle.lat, middle.lng, venues, boostContent, {
    venues_source: venuesSource,
    boost_source: boostSource,
  });
}

export async function getPlanOrNull(slug: string): Promise<Plan | null> {
  const { getEventDetail } = await import("./db");
  const detail = getEventDetail(slug);
  return detail?.plan ?? null;
}
