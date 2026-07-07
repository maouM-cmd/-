"use client";

export function OfflineBanner({
  message,
  className = "",
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-gray-700 ${className}`}
    >
      {message}
    </div>
  );
}

export function useOfflineGuard() {
  const offline = typeof navigator !== "undefined" && !navigator.onLine;
  return { offline, offlineMessage: offline };
}
