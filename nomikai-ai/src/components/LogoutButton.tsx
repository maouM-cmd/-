"use client";

import type { Locale } from "@/lib/i18n";

export function LogoutButton({ locale }: { locale: Locale }) {
  const label = locale === "en" ? "Log out" : "ログアウト";

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="text-sm text-gray-500 hover:text-amber-600"
    >
      {label}
    </button>
  );
}
