import Link from "next/link";

export const OPERATOR_NAME =
  process.env.NEXT_PUBLIC_OPERATOR_NAME ?? "招待みんなでショータイム運営";
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-sm text-violet-600 hover:text-violet-700">
        ← トップに戻る
      </Link>
      <article className="mt-6 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">最終更新日: {lastUpdated}</p>
        <div className="prose-legal mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
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
      <div className="space-y-2">{children}</div>
    </section>
  );
}
