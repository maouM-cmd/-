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
          本サービスでは、ニックネーム、メールアドレス（会員登録時）、OAuthアカウント情報、投稿したプロンプト文、コメント、評価データ、プッシュ通知の購読情報、セッション識別用Cookieを収集します。
        </p>
      </LegalSection>
      <LegalSection title="2. 利用目的">
        <p>
          収集した情報は、サービスの提供、認証、アカウント管理、ランキング表示、プッシュ通知の送信、不正利用の防止、サービス改善のために利用します。
        </p>
      </LegalSection>
      <LegalSection title="3. 外部サービスへの送信">
        <p>
          LLM機能利用時はプロンプト文・課題説明がOpenAI APIに送信されます。OAuthログイン時は各プロバイダ（Google、GitHub、Apple）の認証サービスを利用します。プッシュ通知はブラウザのWeb Push APIを利用します。
        </p>
      </LegalSection>
      <LegalSection title="4. 第三者提供">
        <p>
          法令に基づく場合を除き、利用者の同意なく個人情報を第三者に提供しません。
        </p>
      </LegalSection>
      <LegalSection title="5. Cookie">
        <p>
          セッション管理、OAuth認証、管理者認証のためにCookieを使用します。
        </p>
      </LegalSection>
      <LegalSection title="6. お問い合わせ">
        <p>
          {OPERATOR_NAME} / {CONTACT_EMAIL}
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
