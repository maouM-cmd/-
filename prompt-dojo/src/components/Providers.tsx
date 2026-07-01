"use client";

import { useEffect } from "react";
import { initCapacitorDeepLinks } from "@/lib/capacitor-deeplink";
import { NativePushRegistrar } from "./NativePushRegistrar";
import { OfflineSyncProvider } from "./OfflineSyncProvider";
import { ServiceWorkerRegister } from "./ServiceWorkerRegister";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void initCapacitorDeepLinks();
  }, []);

  return (
    <SessionProvider>
      <OfflineSyncProvider>
        <ServiceWorkerRegister />
        <NativePushRegistrar />
        {children}
      </OfflineSyncProvider>
    </SessionProvider>
  );
}
