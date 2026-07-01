import webpush from "web-push";
import { getPushSubscriptionsByUser } from "./db";

function configureWebPush() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:contact@example.com";

  if (!publicKey || !privateKey) return false;

  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

export function getVapidPublicKey(): string | null {
  return process.env.VAPID_PUBLIC_KEY ?? null;
}

export async function sendPushToUser(
  userId: number,
  payload: { title: string; body: string; url?: string },
): Promise<void> {
  if (!configureWebPush()) return;

  const subscriptions = getPushSubscriptionsByUser(userId);
  const data = JSON.stringify(payload);

  await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        data,
      ),
    ),
  );
}
