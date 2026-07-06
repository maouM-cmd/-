import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { SITE_NAME } from "@/lib/constants";
import { getCurrentUser } from "@/lib/session";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-amber-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-amber-600">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium">
          {user ? (
            <>
              <span className="hidden text-xs text-gray-400 sm:inline">{user.display_name}</span>
              <Link href="/my" className="text-gray-600 hover:text-amber-600">
                マイページ
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login" className="text-gray-600 hover:text-amber-600">
              ログイン
            </Link>
          )}
          <Link
            href="/create"
            className="min-h-[44px] rounded-full bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600"
          >
            飲み会を作る
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-amber-100 py-6 text-center text-xs text-gray-400">
      <p>
        <a href="/terms" className="hover:text-amber-500">
          利用規約
        </a>
        {" · "}
        <a href="/privacy" className="hover:text-amber-500">
          プライバシー
        </a>
      </p>
      <p className="mt-1">店舗情報は参考候補です</p>
    </footer>
  );
}
