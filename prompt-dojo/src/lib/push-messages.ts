import jaMessages from "../../messages/ja.json";
import enMessages from "../../messages/en.json";
import { getUserById } from "./db";
import { sendPushToUser } from "./push";

export type PushLocale = "ja" | "en";

export type PushNotificationType =
  | "comment"
  | "rating"
  | "challengeApproved";

type MessageVars = Record<string, string | number>;

const MESSAGES = { ja: jaMessages.pushNotifications, en: enMessages.pushNotifications };

function normalizeLocale(locale: string | null | undefined): PushLocale {
  return locale === "en" ? "en" : "ja";
}

export function getUserLocale(userId: number): PushLocale {
  const user = getUserById(userId);
  return normalizeLocale(user?.preferred_locale);
}

function interpolate(template: string, vars: MessageVars): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}

export function buildPushPayload(
  type: PushNotificationType,
  locale: PushLocale,
  vars: MessageVars,
): { title: string; body: string } {
  const m = MESSAGES[locale];
  const keys: Record<PushNotificationType, { title: keyof typeof m; body: keyof typeof m }> = {
    comment: { title: "commentTitle", body: "commentBody" },
    rating: { title: "ratingTitle", body: "ratingBody" },
    challengeApproved: { title: "challengeApprovedTitle", body: "challengeApprovedBody" },
  };
  const { title, body } = keys[type];
  return {
    title: interpolate(m[title], vars),
    body: interpolate(m[body], vars),
  };
}

export function buildPushUrl(path: string, locale: PushLocale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.startsWith(`/${locale}/`)) return normalized;
  return `/${locale}${normalized}`;
}

export async function sendLocalizedPush(
  userId: number,
  type: PushNotificationType,
  vars: MessageVars,
  path: string,
): Promise<void> {
  const locale = getUserLocale(userId);
  const { title, body } = buildPushPayload(type, locale, vars);
  const url = buildPushUrl(path, locale);
  await sendPushToUser(userId, { title, body, url });
}
