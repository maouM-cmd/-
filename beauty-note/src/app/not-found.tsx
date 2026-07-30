import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-4xl">💄</p>
      <h1 className="mt-4 text-xl font-bold">ページが見つかりません</h1>
      <Link href="/" className="mt-6 text-sm text-[#a88668]">
        ホームへ戻る
      </Link>
    </main>
  );
}
