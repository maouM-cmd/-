"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";
import { setStoredNativePushToken } from "@/lib/push-client";

/** Registers FCM/APNs token listeners on Capacitor native platforms (no UI). */
export function NativePushRegistrar() {
  const locale = useLocale();

  useEffect(() => {
    let cancelled = false;

    async function setupListeners() {
      const { Capacitor } = await import("@capacitor/core");
      if (!Capacitor.isNativePlatform() || cancelled) return;

      const { PushNotifications } = await import("@capacitor/push-notifications");

      await PushNotifications.addListener("registration", async (token) => {
        setStoredNativePushToken(token.value);
        const platform = Capacitor.getPlatform() === "ios" ? "ios" : "android";
        await fetch("/api/push/register-device", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platform,
            token: token.value,
            locale,
          }),
        });
      });

      await PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
        const url = action.notification.data?.url;
        if (url && typeof url === "string") {
          window.location.href = url.startsWith("/") ? url : `/${url}`;
        }
      });
    }

    void setupListeners();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return null;
}
