import { notFound } from "next/navigation";
import { EventDetailView } from "@/components/EventDetailView";
import { getEventDetail } from "@/lib/db";

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
