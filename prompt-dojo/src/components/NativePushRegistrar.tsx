"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

/** Registers FCM/APNs token on Capacitor native platforms (no UI). */
export function NativePushRegistrar() {
  const locale = useLocale();

  useEffect(() => {
    let cancelled = false;

    async function register() {
      const { Capacitor } = await import("@capacitor/core");
      if (!Capacitor.isNativePlatform() || cancelled) return;

      const { PushNotifications } = await import("@capacitor/push-notifications");

      await PushNotifications.addListener("registration", async (token) => {
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

      const perm = await PushNotifications.requestPermissions();
      if (perm.receive === "granted") {
        await PushNotifications.register();
      }
    }

    void register();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return null;
}
