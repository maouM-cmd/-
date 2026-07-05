import Link from "next/link";
import { CompetitorCompare } from "@/components/CompetitorCompare";
import { SITE_NAME } from "@/lib/constants";

export default function WhyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-medium text-rose-500">競合優位性</p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">
        なぜ{SITE_NAME}か
      </h1>
      <p className="mt-4 leading-relaxed text-gray-600">
        Pairs・Tinderなどのスワイプ型は「量」で勝負します。
        {SITE_NAME}は「最適」を科学します — 相性の根拠が見え、会話まで設計されます。
      </p>

      <div className="mt-10">
        <CompetitorCompare />
      </div>

      <div className="mt-10 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
        <h2 className="font-bold text-emerald-800">ポジショニング一文</h2>
        <p className="mt-2 text-lg font-medium text-gray-800">
          「運任せスワイプ」ではなく「根拠つき最適マッチ」
        </p>
        <p className="mt-2 text-sm text-gray-600">
          ターゲット: 効率よく質の高い出会いを求める人 / 恋愛以外の関係も探す人 / マッチ後の会話に悩む人
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/profile"
          className="rounded-xl bg-rose-500 px-6 py-3 font-bold text-white hover:bg-rose-600"
        >
          無料で試す
        </Link>
        <Link
          href="/discover"
          className="rounded-xl border border-rose-200 px-6 py-3 font-medium text-rose-600 hover:bg-rose-50"
        >
          最適マッチを見る
        </Link>
      </div>
    </div>
  );
}
