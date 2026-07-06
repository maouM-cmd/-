import type { Mood } from "./types";

export const SITE_NAME = "飲み会盛り上げAI";
export const SITE_TAGLINE = "みんなの予定から、最高の飲み会を";

export const BUDGET_OPTIONS = [
  { value: 3000, label: "〜3,000円" },
  { value: 4000, label: "〜4,000円" },
  { value: 5000, label: "〜5,000円" },
  { value: 7000, label: "〜7,000円" },
  { value: 10000, label: "〜10,000円" },
] as const;

export const MOOD_OPTIONS: { value: Mood; label: string; emoji: string }[] = [
  { value: "casual", label: "カジュアル", emoji: "🍻" },
  { value: "lively", label: "ワイワイ", emoji: "🎉" },
  { value: "quiet", label: "落ち着いて", emoji: "🍷" },
  { value: "celebration", label: "お祝い", emoji: "🥂" },
];

export const TIME_SLOTS = [
  { value: "lunch", label: "昼（12:00〜14:00）" },
  { value: "happy_hour", label: "夕方（17:00〜19:00）" },
  { value: "evening", label: "夜（19:00〜21:00）" },
  { value: "late", label: "深夜（21:00〜）" },
] as const;

export const VENUE_TYPES = ["居酒屋", "ダイニングバー", "焼き鳥", "立ち飲み", "ビアホール"] as const;

export const FALLBACK_STATIONS: Record<string, { lat: number; lng: number }> = {
  新宿: { lat: 35.6896, lng: 139.7006 },
  渋谷: { lat: 35.658, lng: 139.7016 },
  池袋: { lat: 35.7295, lng: 139.7109 },
  東京: { lat: 35.6812, lng: 139.7671 },
  品川: { lat: 35.6284, lng: 139.7387 },
  横浜: { lat: 35.4657, lng: 139.622 },
  大宮: { lat: 35.9069, lng: 139.6239 },
  千葉: { lat: 35.6129, lng: 140.1143 },
  吉祥寺: { lat: 35.7031, lng: 139.5798 },
  中野: { lat: 35.7074, lng: 139.6659 },
};
