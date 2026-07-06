import type { Metadata } from "next";
import {
  CONTACT_EMAIL,
  LegalDocument,
  LegalSection,
  OPERATOR_NAME,
} from "@/components/LegalDocument";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `利用規約 | ${SITE_NAME}`,
};

const LAST_UPDATED = "2026年7月6日";

export default function TermsPage() {
  return (
    <LegalDocument title="利用規約" lastUpdated={LAST_UPDATED}>
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
