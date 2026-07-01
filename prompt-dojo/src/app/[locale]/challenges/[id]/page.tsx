import { AdSlot } from "@/components/AdSlot";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubmissionCard } from "@/components/ChallengeCard";
import { NicknameSetup } from "@/components/NicknameSetup";
import { PromptForm } from "@/components/PromptForm";
import { getChallengeById, getSubmissionsByChallenge } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challengeId = Number(id);
  const challenge = getChallengeById(challengeId);
  if (!challenge || challenge.status !== "active") notFound();

  const user = await getCurrentUser();
  const submissions = getSubmissionsByChallenge(challengeId, user?.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        ← 課題一覧
      </Link>

      <article className="mt-4 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{challenge.title}</h1>
        <p className="mt-3 text-gray-700 leading-relaxed">{challenge.description}</p>
        {challenge.sample_output && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-800">期待する出力例</p>
            <p className="mt-1">{challenge.sample_output}</p>
          </div>
        )}
      </article>

      <section className="mt-8">
        <NicknameSetup />
      </section>

      <AdSlot position="inline" className="my-6" />

      <section className="mt-6 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">プロンプトを投稿</h2>
        <PromptForm challengeId={challengeId} />
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold">
          みんなの投稿 ({submissions.length})
        </h2>
        {submissions.length === 0 ? (
          <p className="text-sm text-gray-500">まだ投稿がありません。最初の挑戦者になりましょう！</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {submissions.map((s) => (
              <SubmissionCard key={s.id} submission={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
