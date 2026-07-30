"use client";

import { useTranslations } from "next-intl";
import { useOfflineSync } from "./OfflineSyncProvider";

export function SyncBadge() {
  const { pendingCount } = useOfflineSync();
  const t = useTranslations("sync");

  if (pendingCount === 0) return null;

  return (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
      {t("pending", { count: pendingCount })}
    </span>
  );
}
