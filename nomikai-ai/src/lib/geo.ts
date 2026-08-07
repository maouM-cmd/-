import { FALLBACK_STATIONS } from "./constants";

export interface Coordinates {
  lat: number;
  lng: number;
  station: string;
}

interface HeartRailsStation {
  name: string;
  line: string;
  x: string;
  y: string;
}

async function fetchStations(name: string): Promise<HeartRailsStation[]> {
  const url = `https://express.heartrails.com/api/json?method=getStations&name=${encodeURIComponent(name)}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return [];
  const data = (await res.json()) as { response?: { station?: HeartRailsStation[] } };
  const stations = data.response?.station;
  if (!stations) return [];
  return Array.isArray(stations) ? stations : [stations];
}

function normalizeStationName(name: string): string {
  return name.replace(/駅$/, "").trim();
}

function fallbackCoords(stationName: string): Coordinates | null {
  const normalized = normalizeStationName(stationName);
  for (const [key, coords] of Object.entries(FALLBACK_STATIONS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return { ...coords, station: `${key}駅` };
    }
  }
  return null;
}

export async function stationToCoords(stationName: string): Promise<Coordinates | null> {
  const normalized = normalizeStationName(stationName);
  if (!normalized) return null;

  try {
    const stations = await fetchStations(normalized);
    if (stations.length > 0) {
      const s = stations[0];
      return {
        lat: parseFloat(s.y),
        lng: parseFloat(s.x),
        station: s.name.includes("駅") ? s.name : `${s.name}駅`,
      };
    }
  } catch {
    // fall through to fallback
  }

  return fallbackCoords(normalized);
}

import type { MiddlePoint } from "./types";

export async function findMiddlePoint(stations: string[]): Promise<MiddlePoint> {
  if (stations.length === 0) {
    return { station: "新宿駅", lat: 35.6896, lng: 139.7006 };
  }

  const coordsList: Coordinates[] = [];
  for (const station of stations) {
    const coords = await stationToCoords(station);
    if (coords) coordsList.push(coords);
  }

  if (coordsList.length === 0) {
    return { station: "新宿駅", lat: 35.6896, lng: 139.7006 };
  }

  const avgLat = coordsList.reduce((sum, c) => sum + c.lat, 0) / coordsList.length;
  const avgLng = coordsList.reduce((sum, c) => sum + c.lng, 0) / coordsList.length;

  try {
    const url = `https://express.heartrails.com/api/json?method=getStations&x=${avgLng}&y=${avgLat}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (res.ok) {
      const data = (await res.json()) as { response?: { station?: HeartRailsStation[] } };
      const nearest = data.response?.station;
      const list = nearest ? (Array.isArray(nearest) ? nearest : [nearest]) : [];
      if (list.length > 0) {
        const name = list[0].name;
        const station = name.includes("駅") ? name : `${name}駅`;
        return { station, lat: avgLat, lng: avgLng };
      }
    }
  } catch {
    // fall through
  }

  let closest = coordsList[0];
  let minDist = Infinity;
  for (const c of coordsList) {
    const dist = Math.abs(c.lat - avgLat) + Math.abs(c.lng - avgLng);
    if (dist < minDist) {
      minDist = dist;
      closest = c;
    }
  }
  return { station: closest.station, lat: avgLat, lng: avgLng };
}

export async function findMiddleStation(stations: string[]): Promise<string> {
  const point = await findMiddlePoint(stations);
  return point.station;
}
