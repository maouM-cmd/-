import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDetailView } from "@/components/EventDetailView";
import { absoluteAppUrl } from "@/lib/app-url";
import { moodOptions, SITE_NAME } from "@/lib/constants";
import { getEventDetail } from "@/lib/db";
import { getLocaleFromCookie } from "@/lib/i18n-server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const locale = await getLocaleFromCookie();
  const { slug } = await params;
  const detail = getEventDetail(slug);
  if (!detail) {
    const notFoundTitle =
      locale === "en" ? `Event not found | ${SITE_NAME}` : `イベントが見つかりません | ${SITE_NAME}`;
    return { title: notFoundTitle };
  }

  const { event, participants } = detail;
  const mood = moodOptions(locale).find((m) => m.value === event.mood);
  const description =
    locale === "en"
      ? `Organizer: ${event.organizer_name} / ${participants.length} participants / ${mood?.emoji ?? ""} ${mood?.label ?? ""}`
      : `幹事: ${event.organizer_name} / 参加者 ${participants.length}人 / ${mood?.emoji ?? ""} ${mood?.label ?? ""}`;
  const ogImage = absoluteAppUrl(`/api/og/${slug}`);

  return {
    title: `${event.title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: event.title,
      description,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: event.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: [ogImage],
    },
  };
}

export default async function EventPage({
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

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <EventDetailView detail={detail} editToken={token} locale={locale} />
    </div>
  );
}
