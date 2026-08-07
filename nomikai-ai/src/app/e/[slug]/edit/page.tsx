import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ParticipantEditForm } from "@/components/ParticipantEditForm";
import { getEventDetail } from "@/lib/db";
import { withLang } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";

export default async function ParticipantEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const locale = await getLocaleFromCookie();
  const { slug } = await params;
  const { token } = await searchParams;
  const detail = getEventDetail(slug);
  if (!detail) notFound();

  const t =
    locale === "en"
      ? {
          needLink:
            "An edit link is required. Open the link issued when you registered.",
          toEvent: "Go to event page",
          noAccess: "No edit permission, or participant not found.",
          backToTitle: (title: string) => `← Back to ${title}`,
          title: "Edit response",
          participant: (name: string) => `${name}'s availability`,
        }
      : {
          needLink: "編集用リンクが必要です。参加登録時に発行されたリンクを開いてください。",
          toEvent: "イベントページへ",
          noAccess: "編集権限がないか、参加者が見つかりません。",
          backToTitle: (title: string) => `← ${title} に戻る`,
          title: "回答を編集",
          participant: (name: string) => `${name} さんの参加内容`,
        };

  if (detail.expired) {
    redirect(withLang(`/e/${slug}`, locale));
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <p className="text-sm text-gray-600">{t.needLink}</p>
        <Link href={withLang(`/e/${slug}`, locale)} className="mt-4 inline-block text-amber-600">
          {t.toEvent}
        </Link>
      </div>
    );
  }

  const participant = detail.participants.find((p) => p.participant_token === token);
  if (!participant) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <p className="text-sm text-red-600">{t.noAccess}</p>
        <Link href={withLang(`/e/${slug}`, locale)} className="mt-4 inline-block text-amber-600">
          {t.toEvent}
        </Link>
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
      <p className="mt-2 text-sm text-gray-600">{t.participant(participant.name)}</p>
      <div className="mt-6">
        <ParticipantEditForm
          slug={slug}
          dateOptions={detail.event.date_options}
          participant={participant}
          participantToken={token}
          locale={locale}
        />
      </div>
    </div>
  );
}
