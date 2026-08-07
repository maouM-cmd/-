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
        ? `Privacy Policy | ${SITE_NAME}`
        : `プライバシーポリシー | ${SITE_NAME}`,
  };
}

export default async function PrivacyPage() {
  const locale = await getLocaleFromCookie();

  if (locale === "en") {
    return (
      <LegalDocument title="Privacy Policy" lastUpdated="July 6, 2026">
        <p>
          {OPERATOR_NAME} (&quot;we&quot;) describes how personal information is handled
          in the Service as follows.
        </p>

        <LegalSection title="1. Information We Collect">
          <p>
            We store names, nearest stations, and availability per event. Account
            registration is not required.
          </p>
        </LegalSection>

        <LegalSection title="2. Purpose of Use">
          <p>
            Collected information is used only to generate and display party plans.
          </p>
        </LegalSection>

        <LegalSection title="3. Contact">
          <p>
            Contact: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </LegalSection>
      </LegalDocument>
    );
  }

  return (
    <LegalDocument title="プライバシーポリシー" lastUpdated="2026年7月6日">
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
