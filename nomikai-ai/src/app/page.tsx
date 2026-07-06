import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="text-center">
        <p className="text-4xl">🍻</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{SITE_NAME}</h1>
        <p className="mt-2 text-gray-600">{SITE_TAGLINE}</p>
      </div>

      <div className="mt-10 space-y-4">
        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-gray-900">こんなときに</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>・幹事が日程調整に疲れている</li>
            <li>・みんなの最寄駅がバラバラで場所が決まらない</li>
            <li>・飲み会の盛り上げ役が必要</li>
          </ul>
        </div>

        <div className="grid gap-3">
          {[
            { step: "1", text: "幹事が飲み会を作成してリンクを共有" },
            { step: "2", text: "参加者がスマホから予定・最寄駅を入力" },
            { step: "3", text: "中間地点・お店・盛り上げプランが自動生成" },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-center gap-3 rounded-xl bg-amber-50/80 px-4 py-3"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
                {item.step}
              </span>
              <p className="text-sm text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/create"
        className="mt-10 flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-amber-500 text-lg font-bold text-white shadow-lg hover:bg-amber-600"
      >
        新しい飲み会を作る
      </Link>
    </div>
  );
}
