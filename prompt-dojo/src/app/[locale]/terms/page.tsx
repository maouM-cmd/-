import {
  CONTACT_EMAIL,
  LegalDocument,
  LegalSection,
  OPERATOR_NAME,
} from "@/components/LegalDocument";

export default function TermsPage() {
  return (
    <LegalDocument title="利用規約" lastUpdated="2026年7月1日">
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
        <p>
          本規約に関するお問い合わせ: {CONTACT_EMAIL}
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
