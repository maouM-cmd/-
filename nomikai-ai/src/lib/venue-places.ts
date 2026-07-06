import { BUDGET_OPTIONS, MOOD_OPTIONS } from "./constants";
import type { Mood, VenueCandidate } from "./types";

interface PlacesResponse {
  places?: {
    displayName?: { text?: string };
    formattedAddress?: string;
    rating?: number;
    googleMapsUri?: string;
    location?: { latitude?: number; longitude?: number };
    primaryType?: string;
    types?: string[];
  }[];
}

const MOOD_QUERY: Record<Mood, string> = {
  casual: "居酒屋 カジュアル",
  lively: "居酒屋 宴会",
  quiet: "ダイニングバー 落ち着いた",
  celebration: "居酒屋 個室 お祝い",
};

function budgetLabel(budget: number): string {
  const opt = BUDGET_OPTIONS.find((b) => b.value === budget);
  return opt?.label ?? `〜${budget.toLocaleString()}円`;
}

function moodLabel(mood: Mood): string {
  const opt = MOOD_OPTIONS.find((m) => m.value === mood);
  return opt ? `${opt.emoji} ${opt.label}` : mood;
}

function typeLabel(primaryType?: string, types?: string[]): string {
  const typeSet = new Set([primaryType, ...(types ?? [])].filter(Boolean));
  if (typeSet.has("bar")) return "バー";
  if (typeSet.has("restaurant")) return "レストラン";
  return "居酒屋";
}

export function isPlacesVenueEnabled(): boolean {
  return Boolean(process.env.GOOGLE_MAPS_API_KEY);
}

export async function generateVenueCandidatesPlaces(
  middleStation: string,
  budget: number,
  mood: Mood,
  lat?: number,
  lng?: number
): Promise<VenueCandidate[] | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  const stationBase = middleStation.replace(/駅$/, "");
  const textQuery = `${stationBase}駅 ${MOOD_QUERY[mood]}`;
  const bLabel = budgetLabel(budget);
  const mLabel = moodLabel(mood);

  try {
    const body: Record<string, unknown> = {
      textQuery,
      languageCode: "ja",
      maxResultCount: 5,
    };
    if (lat != null && lng != null) {
      body.locationBias = {
        circle: { center: { latitude: lat, longitude: lng }, radius: 1500 },
      };
    }

    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.rating,places.googleMapsUri,places.location,places.primaryType,places.types",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as PlacesResponse;
    const places = data.places ?? [];
    if (places.length === 0) return null;

    return places.slice(0, 5).map((place) => {
      const name = place.displayName?.text ?? "お店";
      const type = typeLabel(place.primaryType, place.types);
      const rating = place.rating;
      const address = place.formattedAddress ?? "";
      const mapsUrl =
        place.googleMapsUri ??
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + stationBase)}`;

      return {
        name,
        type,
        budgetLabel: bLabel,
        moodLabel: mLabel,
        description: `${address}${rating ? `（評価 ${rating}）` : ""}`.trim() || `${middleStation}周辺の${type}`,
        mapsUrl,
        lat: place.location?.latitude,
        lng: place.location?.longitude,
        rating,
        address,
        source: "places" as const,
      };
    });
  } catch {
    return null;
  }
}
