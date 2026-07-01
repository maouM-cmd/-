import {
  CONTACT_EMAIL,
  LegalDocument,
  LegalSection,
  OPERATOR_NAME,
} from "@/components/LegalDocument";

export default function PrivacyPage() {
  return (
    <LegalDocument title="プライバシーポリシー" lastUpdated="2026年7月1日">
      <LegalSection title="1. 収集する情報">
        <p>
          本サービスでは、ニックネーム、投稿したプロンプト文、評価データ、セッション識別用Cookieを収集します。メールアドレス等の個人を特定できる情報は収集しません。
        </p>
      </LegalSection>
      <LegalSection title="2. 利用目的">
        <p>
          収集した情報は、サービスの提供、ランキング表示、不正利用の防止、サービス改善のために利用します。
        </p>
      </LegalSection>
      <LegalSection title="3. 第三者提供">
        <p>
          法令に基づく場合を除き、利用者の同意なく個人情報を第三者に提供しません。
        </p>
      </LegalSection>
      <LegalSection title="4. Cookie">
        <p>
          セッション管理および管理者認証のためにCookieを使用します。ブラウザの設定でCookieを無効にできますが、一部機能が利用できなくなる場合があります。
        </p>
      </LegalSection>
      <LegalSection title="5. お問い合わせ">
        <p>
          {OPERATOR_NAME} / {CONTACT_EMAIL}
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
