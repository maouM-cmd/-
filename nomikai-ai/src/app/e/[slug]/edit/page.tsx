import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ParticipantEditForm } from "@/components/ParticipantEditForm";
import { getEventDetail } from "@/lib/db";

export default async function ParticipantEditPage({
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

  if (detail.expired) {
    redirect(`/e/${slug}`);
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <p className="text-sm text-gray-600">編集用リンクが必要です。参加登録時に発行されたリンクを開いてください。</p>
        <Link href={`/e/${slug}`} className="mt-4 inline-block text-amber-600">
          イベントページへ
        </Link>
      </div>
    );
  }

  const participant = detail.participants.find((p) => p.participant_token === token);
  if (!participant) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <p className="text-sm text-red-600">編集権限がないか、参加者が見つかりません。</p>
        <Link href={`/e/${slug}`} className="mt-4 inline-block text-amber-600">
          イベントページへ
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href={`/e/${slug}`} className="text-sm text-amber-600 hover:text-amber-700">
        ← {detail.event.title} に戻る
      </Link>
      <h1 className="mt-4 text-xl font-bold text-gray-900">回答を編集</h1>
      <p className="mt-2 text-sm text-gray-600">{participant.name} さんの参加内容</p>
      <div className="mt-6">
        <ParticipantEditForm
          slug={slug}
          dateOptions={detail.event.date_options}
          participant={participant}
          participantToken={token}
        />
      </div>
    </div>
  );
}
