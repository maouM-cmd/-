import Link from "next/link";
import { notFound } from "next/navigation";
import { JoinEventForm } from "@/components/JoinEventForm";
import { getEventDetail } from "@/lib/db";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = getEventDetail(slug);
  if (!detail) notFound();

  if (detail.expired) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <Link href={`/e/${slug}`} className="text-sm text-amber-600">
          ← イベントに戻る
        </Link>
        <p className="mt-4 text-gray-600">この飲み会は終了しているため、新規の参加登録はできません。</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href={`/e/${slug}`} className="text-sm text-amber-600 hover:text-amber-700">
        ← {detail.event.title} に戻る
      </Link>
      <h1 className="mt-4 text-xl font-bold text-gray-900">参加登録</h1>
      <p className="mt-2 text-sm text-gray-600">
        名前・最寄駅・参加可能な日時を入力してください。
      </p>
      <div className="mt-6">
        <JoinEventForm slug={slug} dateOptions={detail.event.date_options} />
      </div>
    </div>
  );
}
