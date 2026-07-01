"use client";

import { SessionProvider } from "next-auth/react";
import { OfflineSyncProvider } from "./OfflineSyncProvider";
import { ServiceWorkerRegister } from "./ServiceWorkerRegister";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <OfflineSyncProvider>
        <ServiceWorkerRegister />
        {children}
      </OfflineSyncProvider>
    </SessionProvider>
  );
}
