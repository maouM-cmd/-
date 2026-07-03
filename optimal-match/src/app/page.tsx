import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { getMyProfile } from "@/lib/db";

export default function HomePage() {
  const me = getMyProfile();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-3xl border border-rose-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-rose-500">マッチングアプリ MVP</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">{SITE_NAME}</h1>
        <p className="mt-3 text-lg text-gray-600">{SITE_TAGLINE}</p>
        <p className="mt-4 text-sm leading-relaxed text-gray-500">
          興味・目的・価値観の3軸で相性スコアを算出し、あなたに最適な人をランキング表示します。
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/profile"
            className="rounded-xl bg-rose-500 px-6 py-3 text-center font-bold text-white hover:bg-rose-600"
          >
            {me ? "プロフィールを編集" : "プロフィールを作成"}
          </Link>
          <Link
            href="/discover"
            className="rounded-xl border border-rose-200 px-6 py-3 text-center font-medium text-rose-600 hover:bg-rose-50"
          >
            最適マッチを見る
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { title: "① プロフィール", desc: "興味・目的・価値観を登録" },
          { title: "② 相性分析", desc: "3軸スコアで自動マッチング" },
          { title: "③ 最適人発見", desc: "ランキングで理想の相手を探す" },
        ].map((step) => (
          <div key={step.title} className="rounded-2xl border border-rose-50 bg-white/80 p-4">
            <h3 className="font-bold text-rose-600">{step.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
