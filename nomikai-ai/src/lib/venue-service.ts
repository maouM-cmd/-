import { generateVenueCandidates as generateVenueCandidatesRuleBased } from "./venue";
import { generateVenueCandidatesPlaces, isPlacesVenueEnabled } from "./venue-places";
import type { Mood, VenueCandidate, VenueSource } from "./types";

export async function generateVenueCandidates(
  middleStation: string,
  budget: number,
  mood: Mood,
  lat?: number,
  lng?: number
): Promise<{ venues: VenueCandidate[]; source: VenueSource }> {
  if (isPlacesVenueEnabled()) {
    const places = await generateVenueCandidatesPlaces(
      middleStation,
      budget,
      mood,
      lat,
      lng
    );
    if (places?.length) return { venues: places, source: "places" };
  }

  return {
    venues: generateVenueCandidatesRuleBased(middleStation, budget, mood).map((v) => ({
      ...v,
      source: "template" as const,
    })),
    source: "template",
  };
}
