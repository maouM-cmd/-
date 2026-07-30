import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalDocument } from "@/components/LegalDocument";
import { PrivacyContentEn, PrivacyContentJa } from "@/components/LegalContent";

export default async function PrivacyPage({
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
      title={t("privacy")}
      lastUpdated={isEn ? "July 1, 2026" : "2026年7月1日"}
      backHome={tl("backHome")}
      lastUpdatedLabel={tl("lastUpdated")}
    >
      {isEn ? <PrivacyContentEn /> : <PrivacyContentJa />}
    </LegalDocument>
  );
}
