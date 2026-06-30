import Link from "next/link";
import { DealForm } from "@/components/DealForm";

export default function PostPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-violet-600 hover:text-violet-700"
        >
          ← 一覧に戻る
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          招待キャンペーンを投稿する
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          あなたの招待リンク・コードをシェアして、みんなにお得情報を届けましょう
        </p>
      </div>

      <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
        <DealForm />
      </div>
    </div>
  );
}
