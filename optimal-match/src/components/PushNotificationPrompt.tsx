"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function PushNotificationPrompt({ loggedIn }: { loggedIn: boolean }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!loggedIn || !("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (Notification.permission === "granted" || Notification.permission === "denied") return;
    if (sessionStorage.getItem("push_prompt_dismissed")) return;

    fetch("/api/push/subscribe")
      .then((r) => r.json())
      .then((data) => {
        if (data.enabled && data.publicKey) setVisible(true);
      })
      .catch(() => {});
  }, [loggedIn]);

  async function enable() {
    setLoading(true);
    try {
      const configRes = await fetch("/api/push/subscribe");
      const config = await configRes.json();
      if (!config.enabled || !config.publicKey) return;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        sessionStorage.setItem("push_prompt_dismissed", "1");
        setVisible(false);
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(config.publicKey),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      setDone(true);
      setVisible(false);
    } finally {
      setLoading(false);
    }
  }

  function dismiss() {
    sessionStorage.setItem("push_prompt_dismissed", "1");
    setVisible(false);
  }

  if (!visible || done) return null;

  return (
    <div className="border-b border-rose-100 bg-rose-50/80 px-4 py-3">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-700">
          マッチやメッセージをプッシュ通知で受け取れます
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={enable}
            disabled={loading}
            className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
          >
            {loading ? "設定中..." : "有効にする"}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            あとで
          </button>
        </div>
      </div>
    </div>
  );
}
