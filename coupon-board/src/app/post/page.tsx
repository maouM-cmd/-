import Link from "next/link";
import { CouponForm } from "@/components/CouponForm";

export default function PostPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-orange-600 hover:text-orange-700"
        >
          ← 一覧に戻る
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          クーポンを投稿する
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          知っている初回特典・クーポン情報をシェアしてください
        </p>
      </div>

      <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
        <CouponForm />
      </div>
    </div>
  );
}
