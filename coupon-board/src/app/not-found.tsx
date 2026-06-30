import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-5xl">🎭</p>
      <h1 className="mt-4 text-xl font-bold text-gray-900">
        案件が見つかりません
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        削除されたか、URLが間違っている可能性があります。
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
      >
        一覧に戻る
      </Link>
    </div>
  );
}
