import Link from "next/link";
import { FavoritesList } from "@/components/FavoritesList";

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/" className="text-sm text-violet-600 hover:text-violet-700">
        ← 一覧に戻る
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">お気に入り</h1>
      <p className="mt-1 text-sm text-gray-500">
        このブラウザに保存された案件一覧です
      </p>
      <div className="mt-8">
        <FavoritesList />
      </div>
    </div>
  );
}
