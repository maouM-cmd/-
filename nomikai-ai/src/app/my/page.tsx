import Link from "next/link";
import { MyEventsList } from "@/components/MyEventsList";
import { getEventsByUserId } from "@/lib/db";
import { withLang } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";
import { requireUser } from "@/lib/session";

export default async function MyPage() {
  const locale = await getLocaleFromCookie();
  const user = await requireUser();
  const events = getEventsByUserId(user.id);
  const t = locale === "en"
    ? {
        title: "My Events",
        subtitle: `${user.display_name}'s events`,
        create: "+ Create a new event",
      }
    : {
        title: "マイページ",
        subtitle: `${user.display_name} さんの飲み会一覧`,
        create: "+ 新しい飲み会を作る",
      };

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
      <p className="mt-2 text-sm text-gray-600">{t.subtitle}</p>
      <div className="mt-6">
        <MyEventsList events={events} locale={locale} />
      </div>
      <Link
        href={withLang("/create", locale)}
        className="mt-6 flex min-h-[48px] w-full items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
      >
        {t.create}
      </Link>
    </div>
  );
}
