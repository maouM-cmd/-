import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Header() {
  return (
    <header className="border-b border-rose-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-rose-600">
          {SITE_NAME}
        </Link>
        <nav className="flex gap-4 text-sm font-medium text-gray-600">
          <Link href="/profile" className="hover:text-rose-600">
            プロフィール
          </Link>
          <Link href="/discover" className="hover:text-rose-600">
            最適マッチ
          </Link>
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
