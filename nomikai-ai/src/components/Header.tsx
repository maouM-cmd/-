import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LogoutButton } from "@/components/LogoutButton";
import { SITE_NAME } from "@/lib/constants";
import { withLang } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";
import { getCurrentUser } from "@/lib/session";

export async function Header() {
  const user = await getCurrentUser();
  const locale = await getLocaleFromCookie();
  const t = locale === "en"
    ? {
        my: "My Events",
        login: "Log in",
        create: "Create Event",
      }
    : {
        my: "マイページ",
        login: "ログイン",
        create: "飲み会を作る",
      };

  return (
    <header className="border-b border-amber-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
        <Link href={withLang("/", locale)} className="text-lg font-bold text-amber-600">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium">
          <LanguageSwitcher locale={locale} />
          {user ? (
            <>
              <span className="hidden text-xs text-gray-400 sm:inline">{user.display_name}</span>
              <Link href={withLang("/my", locale)} className="text-gray-600 hover:text-amber-600">
                {t.my}
              </Link>
              <LogoutButton locale={locale} />
            </>
          ) : (
            <Link href={withLang("/login", locale)} className="text-gray-600 hover:text-amber-600">
              {t.login}
            </Link>
          )}
          <Link
            href={withLang("/create", locale)}
            className="min-h-[44px] rounded-full bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600"
          >
            {t.create}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export async function Footer() {
  const locale = await getLocaleFromCookie();
  const t = locale === "en"
    ? { terms: "Terms", privacy: "Privacy", note: "Venue info is only a suggestion" }
    : { terms: "利用規約", privacy: "プライバシー", note: "店舗情報は参考候補です" };
  return (
    <footer className="border-t border-amber-100 py-6 text-center text-xs text-gray-400">
      <p>
        <a href={withLang("/terms", locale)} className="hover:text-amber-500">
          {t.terms}
        </a>
        {" · "}
        <a href={withLang("/privacy", locale)} className="hover:text-amber-500">
          {t.privacy}
        </a>
      </p>
      <p className="mt-1">{t.note}</p>
    </footer>
  );
}
