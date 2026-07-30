"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { flush, getPendingCount } from "@/lib/offline-queue";

type OfflineSyncContextValue = {
  pendingCount: number;
  refresh: () => Promise<void>;
  syncNow: () => Promise<void>;
};

const OfflineSyncContext = createContext<OfflineSyncContextValue>({
  pendingCount: 0,
  refresh: async () => {},
  syncNow: async () => {},
});

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
  const [pendingCount, setPendingCount] = useState(0);

  const refresh = useCallback(async () => {
    const count = await getPendingCount();
    setPendingCount(count);
  }, []);

  const syncNow = useCallback(async () => {
    await flush();
    await refresh();
  }, [refresh]);

  useEffect(() => {
    let active = true;
    void getPendingCount().then((count) => {
      if (active) setPendingCount(count);
    });

    function handleOnline() {
      void syncNow();
    }
    window.addEventListener("online", handleOnline);
    return () => {
      active = false;
      window.removeEventListener("online", handleOnline);
    };
  }, [syncNow]);

  const value = useMemo(
    () => ({ pendingCount, refresh, syncNow }),
    [pendingCount, refresh, syncNow],
  );

  return (
    <OfflineSyncContext.Provider value={value}>{children}</OfflineSyncContext.Provider>
  );
}

export function useOfflineSync() {
  return useContext(OfflineSyncContext);
}
