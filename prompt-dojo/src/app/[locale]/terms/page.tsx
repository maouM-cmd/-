import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalDocument } from "@/components/LegalDocument";
import { TermsContentEn, TermsContentJa } from "@/components/LegalContent";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("footer");
  const tl = await getTranslations("legal");
  const isEn = locale === "en";

  return (
    <LegalDocument
      title={t("terms")}
      lastUpdated={isEn ? "July 1, 2026" : "2026年7月1日"}
      backHome={tl("backHome")}
      lastUpdatedLabel={tl("lastUpdated")}
    >
      {isEn ? <TermsContentEn /> : <TermsContentJa />}
    </LegalDocument>
  );
}
