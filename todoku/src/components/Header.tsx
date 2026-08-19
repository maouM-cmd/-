import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export function Header() {
  return (
    <header className="border-b border-teal/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-teal">{SITE_NAME}</span>
          <span className="hidden text-sm text-teal/70 sm:inline">{SITE_TAGLINE}</span>
        </div>
        <p className="text-xs text-teal/60">都知事杯オープンデータ・ハッカソン2026</p>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-teal/10 bg-paper">
      <div className="mx-auto max-w-5xl space-y-3 px-4 py-8 text-xs leading-relaxed text-teal/70">
        <p>
          適合判定は、東京都オープンデータカタログ掲載データを簡易ルール化した
          <strong className="font-medium text-teal">参考情報</strong>
          です。申請可否・金額は各窓口の正式判定に従ってください。個人情報はサーバーに送りません。
        </p>
        <p>
          出典の中心: 子育て支援制度レジストリ／医療費公費負担事業等一覧／居宅・介護予防サービス事業所一覧（
          <a
            className="underline decoration-stamp/40 underline-offset-2 hover:text-stamp"
            href="https://catalog.opendata.metro.tokyo.lg.jp/"
            target="_blank"
            rel="noreferrer"
          >
            catalog.opendata.metro.tokyo.lg.jp
          </a>
          ）
        </p>
      </div>
    </footer>
  );
}
