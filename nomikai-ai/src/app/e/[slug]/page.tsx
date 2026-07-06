import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDetailView } from "@/components/EventDetailView";
import { absoluteAppUrl } from "@/lib/app-url";
import { MOOD_OPTIONS, SITE_NAME } from "@/lib/constants";
import { getEventDetail } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = getEventDetail(slug);
  if (!detail) {
    return { title: `イベントが見つかりません | ${SITE_NAME}` };
  }

  const { event, participants } = detail;
  const mood = MOOD_OPTIONS.find((m) => m.value === event.mood);
  const description = `幹事: ${event.organizer_name} / 参加者 ${participants.length}人 / ${mood?.emoji ?? ""} ${mood?.label ?? ""}`;
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
  const { slug } = await params;
  const { token } = await searchParams;
  const detail = getEventDetail(slug);
  if (!detail) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <EventDetailView detail={detail} editToken={token} />
    </div>
  );
}
