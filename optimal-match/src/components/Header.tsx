import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { SITE_NAME } from "@/lib/constants";
import { getCurrentUser } from "@/lib/session";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-rose-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-rose-600">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-gray-600">
          {user ? (
            <>
              <span className="hidden text-xs text-gray-400 sm:inline">{user.display_name}</span>
              <Link href="/why" className="hover:text-rose-600">優位性</Link>
              <Link href="/profile" className="hover:text-rose-600">プロフィール</Link>
              <Link href="/discover" className="hover:text-rose-600">最適マッチ</Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/why" className="hover:text-rose-600">優位性</Link>
              <Link href="/login" className="hover:text-rose-600">ログイン</Link>
              <Link
                href="/signup"
                className="rounded-full bg-rose-500 px-3 py-1 text-white hover:bg-rose-600"
              >
                登録
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-rose-100 py-6 text-center text-xs text-gray-400">
      MVP — 相性スコアは参考値です
    </footer>
  );
}
