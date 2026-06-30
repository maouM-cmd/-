import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-lg text-white shadow-md shadow-orange-200">
            🎫
          </span>
          <div>
            <p className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-orange-600">
              初回クーポン掲示板
            </p>
            <p className="text-xs text-gray-500">みんなで共有する初回特典情報</p>
          </div>
        </Link>
        <Link
          href="/post"
          className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:from-orange-600 hover:to-rose-600 hover:shadow-lg"
        >
          ＋ クーポンを投稿
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-orange-100 bg-white py-8">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-500">
        <p>初回クーポン掲示板 — お得な初回特典をみんなで共有しましょう</p>
        <p className="mt-1 text-xs text-gray-400">
          ※ 掲載情報は投稿時点のものです。利用前に各サービスの公式サイトでご確認ください。
        </p>
      </div>
    </footer>
  );
}
