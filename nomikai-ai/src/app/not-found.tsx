import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <p className="text-4xl">🍶</p>
      <h1 className="mt-4 text-xl font-bold text-gray-900">ページが見つかりません</h1>
      <p className="mt-2 text-sm text-gray-600">リンクが無効か、イベントが削除された可能性があります。</p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-[44px] items-center rounded-xl bg-amber-500 px-6 text-white hover:bg-amber-600"
      >
        トップへ戻る
      </Link>
    </div>
  );
}
