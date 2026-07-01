import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="group flex min-w-0 items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-lg text-white shadow-md shadow-violet-200">
            🎭
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold tracking-tight text-gray-900 group-hover:text-violet-600">
              {SITE_NAME}
            </p>
            <p className="truncate text-xs text-gray-500">{SITE_TAGLINE}</p>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/kit"
            className="hidden rounded-full border border-violet-200 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50 sm:inline-block"
          >
            AI Kit
          </Link>
          <Link
            href="/favorites"
            className="hidden rounded-full border border-amber-200 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 sm:inline-block"
          >
            ☆ お気に入り
          </Link>
          <Link
            href="/post"
            className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-fuchsia-600 sm:px-5"
          >
            ＋ 投稿
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-violet-100 bg-white py-8">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-500">
        <p>{SITE_NAME} — 紹介キャンペーンをみんなで共有する掲示板</p>
        <nav className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          <Link href="/kit" className="text-violet-600 hover:underline">
            AI Dashboard Kit
          </Link>
          <Link href="/tools/compare" className="text-violet-600 hover:underline">
            Company Compare
          </Link>
          <Link href="/terms" className="text-violet-600 hover:underline">
            利用規約
          </Link>
          <Link href="/privacy" className="text-violet-600 hover:underline">
            プライバシーポリシー
          </Link>
        </nav>
        <p className="mt-3 text-xs text-gray-400">
          ※ 掲載情報は投稿者によるものです。利用前に各サービスの公式条件をご確認ください。
        </p>
        <p className="mt-1 text-xs text-gray-400">
          当サイトは広告を掲載しています。
        </p>
      </div>
    </footer>
  );
}
