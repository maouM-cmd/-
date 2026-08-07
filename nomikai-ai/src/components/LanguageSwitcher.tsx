"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function buildHref(nextLocale: Locale) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextLocale === "ja") params.delete("lang");
    else params.set("lang", "en");
    const q = params.toString();
    return q ? `${pathname}?${q}` : pathname;
  }

  return (
    <div className="rounded-full border border-gray-200 p-0.5 text-xs">
      <Link
        href={buildHref("ja")}
        className={`rounded-full px-2 py-1 ${locale === "ja" ? "bg-amber-500 text-white" : "text-gray-600"}`}
      >
        JA
      </Link>
      <Link
        href={buildHref("en")}
        className={`rounded-full px-2 py-1 ${locale === "en" ? "bg-amber-500 text-white" : "text-gray-600"}`}
      >
        EN
      </Link>
    </div>
  );
}
