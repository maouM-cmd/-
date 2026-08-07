import type { Metadata } from "next";
import {
  CONTACT_EMAIL,
  LegalDocument,
  LegalSection,
  OPERATOR_NAME,
} from "@/components/LegalDocument";
import { SITE_NAME } from "@/lib/constants";
import { getLocaleFromCookie } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookie();
  return {
    title:
      locale === "en"
        ? `Terms of Service | ${SITE_NAME}`
        : `利用規約 | ${SITE_NAME}`,
  };
}

export default async function TermsPage() {
  const locale = await getLocaleFromCookie();

  if (locale === "en") {
    return (
      <LegalDocument title="Terms of Service" lastUpdated="July 6, 2026">
        <p>
          These Terms of Service govern your use of &quot;{SITE_NAME}&quot; (the
          &quot;Service&quot;) provided by {OPERATOR_NAME}.
        </p>

        <LegalSection title="Article 1 (Service Description)">
          <p>
            The Service helps organize drinking parties by coordinating schedules,
            calculating meeting points, suggesting venues, and generating party content.
          </p>
        </LegalSection>

        <LegalSection title="Article 2 (Important Notes)">
          <p>
            Venue suggestions and party content are for reference only. Reservations
            and actual use are at your own responsibility. Alcohol consumption is
            limited to persons aged 20 and over in Japan.
          </p>
        </LegalSection>

        <LegalSection title="Article 3 (Contact)">
          <p>
            Contact: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </LegalSection>
      </LegalDocument>
    );
  }

  return (
    <LegalDocument title="利用規約" lastUpdated="2026年7月6日">
      <p>
        本利用規約は、{OPERATOR_NAME}が提供する「{SITE_NAME}」（以下「本サービス」）の利用条件を定めるものです。
      </p>

      <LegalSection title="第1条（サービス内容）">
        <p>
          本サービスは、飲み会の日程調整・中間地点算出・店舗候補提示・盛り上げコンテンツ生成を行うWebサービスです。
        </p>
      </LegalSection>

      <LegalSection title="第2条（利用上の注意）">
        <p>
          店舗候補・盛り上げコンテンツは参考情報です。実際の予約・利用はご自身の責任で行ってください。
          飲酒は20歳以上の方に限ります。
        </p>
      </LegalSection>

      <LegalSection title="第3条（お問い合わせ）">
        <p>
          お問い合わせ: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
