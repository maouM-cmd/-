import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-lg text-white shadow-md shadow-violet-200">
            🎭
          </span>
          <div>
            <p className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-violet-600">
              {SITE_NAME}
            </p>
            <p className="text-xs text-gray-500">{SITE_TAGLINE}</p>
          </div>
        </Link>
        <Link
          href="/post"
          className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-fuchsia-600 hover:shadow-lg"
        >
          ＋ 招待を投稿
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-violet-100 bg-white py-8">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-500">
        <p>
          {SITE_NAME} — 紹介キャンペーンをみんなで共有する掲示板
        </p>
        <p className="mt-1 text-xs text-gray-400">
          ※ 掲載情報は投稿者によるものです。利用前に各サービスの公式条件をご確認ください。
        </p>
      </div>
    </footer>
  );
}
