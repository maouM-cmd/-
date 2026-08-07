import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { withLang } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";

export default async function HomePage() {
  const locale = await getLocaleFromCookie();
  const t = locale === "en"
    ? {
        useCases: "When this helps",
        c1: "The organizer is tired of schedule coordination",
        c2: "Everyone lives near different stations",
        c3: "You want ready-to-use party prompts",
        s1: "Organizer creates an event and shares the link",
        s2: "Participants submit availability and nearest station",
        s3: "Middle point, venues, and boost plan are auto-generated",
        cta: "Create a new event",
      }
    : {
        useCases: "こんなときに",
        c1: "幹事が日程調整に疲れている",
        c2: "みんなの最寄駅がバラバラで場所が決まらない",
        c3: "飲み会の盛り上げ役が必要",
        s1: "幹事が飲み会を作成してリンクを共有",
        s2: "参加者がスマホから予定・最寄駅を入力",
        s3: "中間地点・お店・盛り上げプランが自動生成",
        cta: "新しい飲み会を作る",
      };

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="text-center">
        <p className="text-4xl">🍻</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{SITE_NAME}</h1>
        <p className="mt-2 text-gray-600">{SITE_TAGLINE}</p>
      </div>

      <div className="mt-10 space-y-4">
        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-gray-900">{t.useCases}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>・{t.c1}</li>
            <li>・{t.c2}</li>
            <li>・{t.c3}</li>
          </ul>
        </div>

        <div className="grid gap-3">
          {[
            { step: "1", text: t.s1 },
            { step: "2", text: t.s2 },
            { step: "3", text: t.s3 },
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
        href={withLang("/create", locale)}
        className="mt-10 flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-amber-500 text-lg font-bold text-white shadow-lg hover:bg-amber-600"
      >
        {t.cta}
      </Link>
    </div>
  );
}
