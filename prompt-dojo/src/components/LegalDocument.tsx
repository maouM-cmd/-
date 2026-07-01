import { Link } from "@/i18n/routing";

export const OPERATOR_NAME =
  process.env.NEXT_PUBLIC_OPERATOR_NAME ?? "プロンプ道場運営";
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@example.com";

export function LegalDocument({
  title,
  lastUpdated,
  backHome,
  lastUpdatedLabel,
  children,
}: {
  title: string;
  lastUpdated: string;
  backHome: string;
  lastUpdatedLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-700">
        {backHome}
      </Link>
      <article className="mt-6 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">
          {lastUpdatedLabel}: {lastUpdated}
        </p>
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
      <div className="space-y-2">{children}</div>
    </section>
  );
}
