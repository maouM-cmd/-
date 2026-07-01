import {
  CONTACT_EMAIL,
  LegalSection,
  OPERATOR_NAME,
} from "@/components/LegalDocument";

export function TermsContentJa() {
  return (
    <>
      <LegalSection title="第1条（適用）">
        <p>
          本規約は、{OPERATOR_NAME}（以下「当運営」）が提供する「プロンプ道場」（以下「本サービス」）の利用条件を定めるものです。利用者は本規約に同意のうえ本サービスを利用するものとします。
        </p>
      </LegalSection>
      <LegalSection title="第2条（サービス内容）">
        <p>
          本サービスは、プロンプト作成の練習・評価を目的としたWebアプリケーションです。自動採点は構造チェックによる参考値であり、AI出力の品質を保証するものではありません。
        </p>
      </LegalSection>
      <LegalSection title="第3条（投稿内容）">
        <p>
          利用者は、法令に違反する内容、他者の権利を侵害する内容、わいせつ・差別的・暴力的な内容を投稿してはなりません。当運営は不適切な投稿を削除できるものとします。
        </p>
      </LegalSection>
      <LegalSection title="第4条（免責）">
        <p>
          本サービスは現状有姿で提供されます。当運営は、本サービスの利用により生じた損害について、故意または重過失がある場合を除き責任を負いません。
        </p>
      </LegalSection>
      <LegalSection title="第5条（お問い合わせ）">
        <p>本規約に関するお問い合わせ: {CONTACT_EMAIL}</p>
      </LegalSection>
    </>
  );
}

export function TermsContentEn() {
  return (
    <>
      <LegalSection title="Article 1 (Scope)">
        <p>
          These Terms govern your use of Prompt Dojo (the &quot;Service&quot;) provided by {OPERATOR_NAME} (&quot;we&quot;). By using the Service, you agree to these Terms.
        </p>
      </LegalSection>
      <LegalSection title="Article 2 (Service)">
        <p>
          The Service is a web application for practicing and evaluating prompts. Auto scores are structural reference values only and do not guarantee AI output quality.
        </p>
      </LegalSection>
      <LegalSection title="Article 3 (User Content)">
        <p>
          You must not post content that violates laws, infringes others&apos; rights, or is obscene, discriminatory, or violent. We may remove inappropriate content.
        </p>
      </LegalSection>
      <LegalSection title="Article 4 (Disclaimer)">
        <p>
          The Service is provided &quot;as is.&quot; We are not liable for damages arising from use of the Service except in cases of willful misconduct or gross negligence.
        </p>
      </LegalSection>
      <LegalSection title="Article 5 (Contact)">
        <p>Questions about these Terms: {CONTACT_EMAIL}</p>
      </LegalSection>
    </>
  );
}

export function PrivacyContentJa() {
  return (
    <>
      <LegalSection title="1. 収集する情報">
        <p>
          本サービスでは、ニックネーム、メールアドレス（会員登録時）、OAuthアカウント情報、投稿したプロンプト文、コメント、評価データ、プッシュ通知の購読情報、セッション識別用Cookieを収集します。
        </p>
      </LegalSection>
      <LegalSection title="2. 利用目的">
        <p>
          収集した情報は、サービスの提供、認証、アカウント管理、メールアドレス確認・パスワードリセットメールの送信、ランキング表示、プッシュ通知の送信、不正利用の防止、サービス改善のために利用します。
        </p>
      </LegalSection>
      <LegalSection title="3. 外部サービスへの送信">
        <p>
          LLM機能利用時はプロンプト文・課題説明がOpenAI APIに送信されます。OAuthログイン時は各プロバイダ（Google、GitHub、Apple）の認証サービスを利用します。プッシュ通知はブラウザのWeb Push APIを利用します。メール送信時は設定されたSMTPサーバーを利用します。
        </p>
      </LegalSection>
      <LegalSection title="4. 第三者提供">
        <p>法令に基づく場合を除き、利用者の同意なく個人情報を第三者に提供しません。</p>
      </LegalSection>
      <LegalSection title="5. Cookie">
        <p>セッション管理、OAuth認証、管理者認証のためにCookieを使用します。</p>
      </LegalSection>
      <LegalSection title="6. お問い合わせ">
        <p>
          {OPERATOR_NAME} / {CONTACT_EMAIL}
        </p>
      </LegalSection>
    </>
  );
}

export function PrivacyContentEn() {
  return (
    <>
      <LegalSection title="1. Information We Collect">
        <p>
          We collect nicknames, email addresses (when registering), OAuth account information, submitted prompts, comments, ratings, push subscription data, and session cookies.
        </p>
      </LegalSection>
      <LegalSection title="2. How We Use Information">
        <p>
          We use collected information to provide the Service, authenticate users, manage accounts, send verification and password-reset emails, display rankings, send push notifications, prevent abuse, and improve the Service.
        </p>
      </LegalSection>
      <LegalSection title="3. Third-Party Services">
        <p>
          Prompt text and challenge descriptions are sent to the OpenAI API when using LLM features. OAuth login uses Google, GitHub, or Apple. Push notifications use the Web Push API. Email uses configured SMTP servers.
        </p>
      </LegalSection>
      <LegalSection title="4. Sharing with Third Parties">
        <p>We do not share personal information with third parties without consent, except as required by law.</p>
      </LegalSection>
      <LegalSection title="5. Cookies">
        <p>We use cookies for session management, OAuth, and admin authentication.</p>
      </LegalSection>
      <LegalSection title="6. Contact">
        <p>
          {OPERATOR_NAME} / {CONTACT_EMAIL}
        </p>
      </LegalSection>
    </>
  );
}
