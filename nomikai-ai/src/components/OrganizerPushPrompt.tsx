"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function OrganizerPushPrompt({
  slug,
  editToken,
}: {
  slug: string;
  editToken: string;
}) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (Notification.permission === "granted" || Notification.permission === "denied") return;
    const key = `push_dismissed_${slug}`;
    if (sessionStorage.getItem(key)) return;

    fetch("/api/push/subscribe")
      .then((r) => r.json())
      .then((data) => {
        if (data.enabled && data.publicKey) setVisible(true);
      })
      .catch(() => {});
  }, [slug]);

  async function enable() {
    setLoading(true);
    try {
      const configRes = await fetch("/api/push/subscribe");
      const config = await configRes.json();
      if (!config.enabled || !config.publicKey) return;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        sessionStorage.setItem(`push_dismissed_${slug}`, "1");
        setVisible(false);
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(config.publicKey),
      });

      const subJson = subscription.toJSON();
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          edit_token: editToken,
          endpoint: subJson.endpoint,
          keys: subJson.keys,
        }),
      });

      setDone(true);
      setVisible(false);
    } finally {
      setLoading(false);
    }
  }

  function dismiss() {
    sessionStorage.setItem(`push_dismissed_${slug}`, "1");
    setVisible(false);
  }

  if (!visible || done) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
      <p className="text-sm text-gray-700">
        参加者が登録したらプッシュ通知でお知らせします（幹事向け）
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={enable}
          disabled={loading}
          className="min-h-[44px] rounded-lg bg-amber-500 px-4 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {loading ? "設定中..." : "通知を有効にする"}
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="min-h-[44px] rounded-lg px-4 text-sm text-gray-500 hover:text-gray-700"
        >
          あとで
        </button>
      </div>
    </div>
  );
}
