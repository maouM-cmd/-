"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { mapApiError } from "@/lib/map-api-error";
import {
  clearStoredNativePushToken,
  getStoredNativePushToken,
} from "@/lib/push-client";

export function PushNotifyButton() {
  const t = useTranslations();
  const tp = useTranslations("push");
  const [isNative, setIsNative] = useState(false);
  const [webSupported, setWebSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void import("@capacitor/core").then(({ Capacitor }) => {
      if (Capacitor.isNativePlatform()) {
        setIsNative(true);
        setSubscribed(!!getStoredNativePushToken());
        return;
      }
      setWebSupported("serviceWorker" in navigator && "PushManager" in window);
    });
  }, []);

  useEffect(() => {
    if (isNative || !webSupported) return;

    async function checkWebSubscription() {
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          setSubscribed(true);
        }
      } catch {
        // ignore
      }
    }

    void checkWebSubscription();
  }, [isNative, webSupported]);

  async function subscribeWeb() {
    setLoading(true);
    setMessage("");

    try {
      const keyRes = await fetch("/api/push/subscribe");
      const { publicKey } = await keyRes.json();
      if (!publicKey) {
        setMessage(tp("unavailable"));
        setLoading(false);
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setMessage(tp("denied"));
        setLoading(false);
        return;
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const json = sub.toJSON();
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: json.keys,
        }),
      });

      if (res.ok) {
        setSubscribed(true);
        setMessage(tp("enabledMessage"));
      } else {
        const data = await res.json();
        setMessage(mapApiError(data, t));
      }
    } catch {
      setMessage(tp("failed"));
    }

    setLoading(false);
  }

  async function subscribeNative() {
    setLoading(true);
    setMessage("");
    try {
      const { PushNotifications } = await import("@capacitor/push-notifications");
      const perm = await PushNotifications.requestPermissions();
      if (perm.receive !== "granted") {
        setMessage(tp("denied"));
        setLoading(false);
        return;
      }
      await PushNotifications.register();
      setSubscribed(true);
      setMessage(tp("enabledMessage"));
    } catch {
      setMessage(tp("failed"));
    }
    setLoading(false);
  }

  async function unsubscribeWeb() {
    setLoading(true);
    setMessage("");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const endpoint = sub.endpoint;
        await sub.unsubscribe();
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint }),
        });
      }
      setSubscribed(false);
      setMessage(tp("disabledMessage"));
    } catch {
      setMessage(tp("failed"));
    }
    setLoading(false);
  }

  async function unsubscribeNative() {
    setLoading(true);
    setMessage("");
    try {
      const token = getStoredNativePushToken();
      if (token) {
        await fetch("/api/push/register-device", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        clearStoredNativePushToken();
      }
      setSubscribed(false);
      setMessage(tp("disabledMessage"));
    } catch {
      setMessage(tp("failed"));
    }
    setLoading(false);
  }

  if (!isNative && !webSupported) return null;

  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
      <p className="text-sm font-medium text-indigo-900">{tp("title")}</p>
      <p className="mt-1 text-xs text-indigo-700">{tp("desc")}</p>
      {!subscribed ? (
        <button
          type="button"
          onClick={isNative ? subscribeNative : subscribeWeb}
          disabled={loading}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {loading ? tp("subscribing") : tp("subscribe")}
        </button>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="text-sm text-emerald-600">{tp("enabled")}</p>
          <button
            type="button"
            onClick={isNative ? unsubscribeNative : unsubscribeWeb}
            disabled={loading}
            className="rounded-lg border border-indigo-300 px-3 py-1.5 text-sm text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
          >
            {loading ? tp("subscribing") : tp("unsubscribe")}
          </button>
        </div>
      )}
      {message && <p className="mt-2 text-xs text-gray-600">{message}</p>}
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
