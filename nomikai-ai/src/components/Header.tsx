import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Header() {
  return (
    <header className="border-b border-amber-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-amber-600">
          {SITE_NAME}
        </Link>
        <Link
          href="/create"
          className="min-h-[44px] rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          飲み会を作る
        </Link>
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
      <p className="mt-1">MVP — 店舗情報は参考候補です</p>
    </footer>
  );
}
