import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-xl font-bold">見つかりません</h1>
      <Link href="/discover" className="mt-4 inline-block text-rose-600 underline">
        マッチ一覧へ
      </Link>
    </div>
  );
}
