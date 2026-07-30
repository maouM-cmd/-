"use client";

import { useState } from "react";

export function PushNotifyButton() {
  const [supported] = useState(
    () =>
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window,
  );
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function subscribe() {
    setLoading(true);
    setMessage("");

    try {
      const keyRes = await fetch("/api/push/subscribe");
      const { publicKey } = await keyRes.json();
      if (!publicKey) {
        setMessage("プッシュ通知は現在利用できません");
        setLoading(false);
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setMessage("通知が許可されませんでした");
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
        setMessage("通知を有効にしました");
      } else {
        const data = await res.json();
        setMessage(data.error ?? "登録に失敗しました");
      }
    } catch {
      setMessage("通知の設定に失敗しました");
    }

    setLoading(false);
  }

  if (!supported) return null;

  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
      <p className="text-sm font-medium text-indigo-900">プッシュ通知</p>
      <p className="mt-1 text-xs text-indigo-700">
        コメント・評価・課題承認をお知らせします
      </p>
      {!subscribed ? (
        <button
          type="button"
          onClick={subscribe}
          disabled={loading}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {loading ? "設定中..." : "通知を受け取る"}
        </button>
      ) : (
        <p className="mt-3 text-sm text-emerald-600">通知 ON</p>
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
