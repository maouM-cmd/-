import type { Locale } from "./i18n";
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

export const EVENT_TTL_DAYS = 30;

export function budgetOptions(locale: Locale) {
  if (locale === "en") {
    return [
      { value: 3000, label: "Up to ¥3,000" },
      { value: 4000, label: "Up to ¥4,000" },
      { value: 5000, label: "Up to ¥5,000" },
      { value: 7000, label: "Up to ¥7,000" },
      { value: 10000, label: "Up to ¥10,000" },
    ] as const;
  }
  return BUDGET_OPTIONS;
}

export function moodOptions(locale: Locale) {
  if (locale === "en") {
    return [
      { value: "casual" as Mood, label: "Casual", emoji: "🍻" },
      { value: "lively" as Mood, label: "Lively", emoji: "🎉" },
      { value: "quiet" as Mood, label: "Quiet", emoji: "🍷" },
      { value: "celebration" as Mood, label: "Celebration", emoji: "🥂" },
    ];
  }
  return MOOD_OPTIONS;
}

export function timeSlots(locale: Locale) {
  if (locale === "en") {
    return [
      { value: "lunch", label: "Lunch (12:00–14:00)" },
      { value: "happy_hour", label: "Happy hour (17:00–19:00)" },
      { value: "evening", label: "Evening (19:00–21:00)" },
      { value: "late", label: "Late night (21:00+)" },
    ] as const;
  }
  return TIME_SLOTS;
}

export function formatDateLabel(date: string, locale: Locale): string {
  const d = new Date(`${date}T12:00:00`);
  if (locale === "en") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${d.getMonth() + 1}/${d.getDate()} (${days[d.getDay()]})`;
  }
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}/${d.getDate()}(${days[d.getDay()]})`;
}

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
