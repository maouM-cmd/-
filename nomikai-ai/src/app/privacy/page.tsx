import type { Metadata } from "next";
import {
  CONTACT_EMAIL,
  LegalDocument,
  LegalSection,
  OPERATOR_NAME,
} from "@/components/LegalDocument";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `プライバシーポリシー | ${SITE_NAME}`,
};

const LAST_UPDATED = "2026年7月6日";

export default function PrivacyPage() {
  return (
    <LegalDocument title="プライバシーポリシー" lastUpdated={LAST_UPDATED}>
      <p>
        {OPERATOR_NAME}（以下「当運営」）は、本サービスにおける個人情報の取扱いについて、以下のとおり定めます。
      </p>

      <LegalSection title="1. 収集する情報">
        <p>
          本サービスでは、入力された名前・最寄駅・参加可能日時をイベント単位で保存します。
          アカウント登録は不要です。
        </p>
      </LegalSection>

      <LegalSection title="2. 利用目的">
        <p>収集した情報は、飲み会プランの生成・表示のためにのみ利用します。</p>
      </LegalSection>

      <LegalSection title="3. お問い合わせ">
        <p>
          お問い合わせ: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
