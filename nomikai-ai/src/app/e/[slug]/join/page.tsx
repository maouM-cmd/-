import Link from "next/link";
import { notFound } from "next/navigation";
import { JoinEventForm } from "@/components/JoinEventForm";
import { getEventDetail } from "@/lib/db";
import { withLang } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getLocaleFromCookie();
  const { slug } = await params;
  const detail = getEventDetail(slug);
  if (!detail) notFound();

  const t =
    locale === "en"
      ? {
          backToEvent: "← Back to event",
          backToTitle: (title: string) => `← Back to ${title}`,
          expired: "This event has ended. New registrations are not accepted.",
          title: "Join event",
          hint: "Enter your name, nearest station, and available times.",
        }
      : {
          backToEvent: "← イベントに戻る",
          backToTitle: (title: string) => `← ${title} に戻る`,
          expired: "この飲み会は終了しているため、新規の参加登録はできません。",
          title: "参加登録",
          hint: "名前・最寄駅・参加可能な日時を入力してください。",
        };

  if (detail.expired) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <Link href={withLang(`/e/${slug}`, locale)} className="text-sm text-amber-600">
          {t.backToEvent}
        </Link>
        <p className="mt-4 text-gray-600">{t.expired}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link
        href={withLang(`/e/${slug}`, locale)}
        className="text-sm text-amber-600 hover:text-amber-700"
      >
        {t.backToTitle(detail.event.title)}
      </Link>
      <h1 className="mt-4 text-xl font-bold text-gray-900">{t.title}</h1>
      <p className="mt-2 text-sm text-gray-600">{t.hint}</p>
      <div className="mt-6">
        <JoinEventForm slug={slug} dateOptions={detail.event.date_options} locale={locale} />
      </div>
    </div>
  );
}
