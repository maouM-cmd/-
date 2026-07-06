import Link from "next/link";

export const OPERATOR_NAME =
  process.env.NEXT_PUBLIC_OPERATOR_NAME ?? "飲み会盛り上げAI運営";
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@example.com";

export function LegalDocument({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link href="/" className="text-sm text-amber-600 hover:text-amber-700">
        ← トップに戻る
      </Link>
      <article className="mt-6 rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">最終更新日: {lastUpdated}</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
          {children}
        </div>
      </article>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 text-base font-bold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}
