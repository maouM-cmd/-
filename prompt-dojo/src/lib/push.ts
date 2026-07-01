import webpush from "web-push";
import {
  deleteDeviceTokenByValue,
  deletePushSubscriptionByEndpoint,
  getDeviceTokensByUser,
  getPushSubscriptionsByUser,
} from "./db";

export type PushPayload = { title: string; body: string; url?: string };

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

function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

async function getFirebaseMessaging() {
  if (!isFirebaseConfigured()) return null;
  const { getApps, initializeApp, cert } = await import("firebase-admin/app");
  const { getMessaging } = await import("firebase-admin/messaging");
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getMessaging();
}

async function sendWebPush(userId: number, payload: PushPayload): Promise<void> {
  if (!configureWebPush()) return;

  const subscriptions = getPushSubscriptionsByUser(userId);
  const data = JSON.stringify(payload);

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          data,
        );
      } catch (err: unknown) {
        const status = (err as { statusCode?: number })?.statusCode;
        if (status === 404 || status === 410) {
          deletePushSubscriptionByEndpoint(sub.endpoint);
        }
      }
    }),
  );
}

async function sendFcmPush(userId: number, payload: PushPayload): Promise<void> {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  const tokens = getDeviceTokensByUser(userId).map((d) => d.token);
  if (tokens.length === 0) return;

  const response = await messaging.sendEachForMulticast({
    tokens,
    notification: {
      title: payload.title,
      body: payload.body,
    },
    data: {
      url: payload.url ?? "/",
    },
  });

  response.responses.forEach((res, index) => {
    if (!res.success && res.error) {
      const code = res.error.code;
      if (
        code === "messaging/registration-token-not-registered" ||
        code === "messaging/invalid-registration-token"
      ) {
        deleteDeviceTokenByValue(tokens[index]);
      }
    }
  });
}

export async function sendPushToUser(userId: number, payload: PushPayload): Promise<void> {
  await Promise.allSettled([sendWebPush(userId, payload), sendFcmPush(userId, payload)]);
}
