"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Header() {
  const t = useTranslations("header");
  const tc = useTranslations("common");

  return (
    <header className="sticky top-0 z-50 border-b border-indigo-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="group flex min-w-0 items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-lg text-white shadow-md shadow-indigo-200">
            ✍
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold tracking-tight text-gray-900 group-hover:text-indigo-600">
              {tc("siteName")}
            </p>
            <p className="truncate text-xs text-gray-500">{tc("tagline")}</p>
          </div>
        </Link>
        <nav className="flex shrink-0 items-center gap-2">
          <LocaleSwitcher />
          <Link
            href="/challenges/new"
            className="hidden rounded-full border border-cyan-200 px-3 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-50 sm:inline-block"
          >
            {t("postChallenge")}
          </Link>
          <Link
            href="/leaderboard"
            className="hidden rounded-full border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 sm:inline-block"
          >
            {t("leaderboard")}
          </Link>
          <Link
            href="/history"
            className="rounded-full border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
          >
            {t("history")}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("common");

  return (
    <footer className="mt-auto border-t border-indigo-100 bg-white py-8">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-500">
        <p>
          {tc("siteName")} — {t("tagline")}
        </p>
        <nav className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          <Link href="/terms" className="text-indigo-600 hover:underline">
            {t("terms")}
          </Link>
          <Link href="/privacy" className="text-indigo-600 hover:underline">
            {t("privacy")}
          </Link>
        </nav>
        <p className="mt-3 text-xs text-gray-400">{t("note")}</p>
      </div>
    </footer>
  );
}
