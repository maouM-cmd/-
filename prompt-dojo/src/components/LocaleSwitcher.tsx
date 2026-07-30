"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTransition } from "react";
import { updateUserLocale } from "@/lib/locale-client";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function switchLocale(next: string) {
    if (next === locale) return;
    startTransition(() => {
      void updateUserLocale(next);
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div className="flex rounded-full border border-indigo-200 p-0.5 text-xs">
      {(["ja", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          disabled={pending}
          onClick={() => switchLocale(l)}
          className={`rounded-full px-2.5 py-1 font-medium uppercase ${
            locale === l ? "bg-indigo-600 text-white" : "text-indigo-700"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
