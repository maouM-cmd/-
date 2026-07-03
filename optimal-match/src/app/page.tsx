import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { COMPETITIVE_PILLARS } from "@/lib/insights";
import { getMyProfile } from "@/lib/db";

export default function HomePage() {
  const me = getMyProfile();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-3xl border border-rose-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-rose-500">
          運任せスワイプに疲れた人へ
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">{SITE_NAME}</h1>
        <p className="mt-3 text-lg text-gray-600">{SITE_TAGLINE}</p>
        <p className="mt-4 text-sm leading-relaxed text-gray-500">
          相性の<strong className="text-gray-700">根拠が見える</strong>、
          <strong className="text-gray-700">遊び型・誠実型を判定</strong>、
          <strong className="text-gray-700">最適順ランキング</strong>
          — 3つの競合優位で、質の高い出会いを効率化します。
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/profile"
            className="rounded-xl bg-rose-500 px-6 py-3 text-center font-bold text-white hover:bg-rose-600"
          >
            {me ? "プロフィールを編集" : "無料で最適マッチを試す"}
          </Link>
          <Link
            href="/why"
            className="rounded-xl border border-rose-200 px-6 py-3 text-center font-medium text-rose-600 hover:bg-rose-50"
          >
            競合との違い
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {COMPETITIVE_PILLARS.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-rose-50 bg-white/80 p-4"
          >
            <h3 className="font-bold text-rose-600">{p.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{p.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link href="/discover" className="text-sm font-medium text-rose-500 hover:underline">
          最適マッチ一覧を見る →
        </Link>
      </div>
    </div>
  );
}
