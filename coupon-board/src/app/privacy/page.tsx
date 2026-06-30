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
  description: `${SITE_NAME}のプライバシーポリシー`,
};

const LAST_UPDATED = "2026年6月30日";

export default function PrivacyPage() {
  return (
    <LegalDocument title="プライバシーポリシー" lastUpdated={LAST_UPDATED}>
      <p>
        {OPERATOR_NAME}（以下「当運営」）は、「{SITE_NAME}」（以下「本サービス」）における
        ユーザーの個人情報・利用情報の取扱いについて、以下のとおりプライバシーポリシー
        （以下「本ポリシー」）を定めます。
      </p>

      <LegalSection title="1. 収集する情報">
        <p>当運営は、本サービスの提供にあたり、以下の情報を収集する場合があります。</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>投稿情報:</strong>{" "}
            サービス名、特典内容、招待リンク・コード、コメント、ニックネーム（任意）、
            スクリーンショット、利用条件等
          </li>
          <li>
            <strong>利用情報:</strong>{" "}
            「役に立った」「使えた/使えなかった」等の操作、通報内容
          </li>
          <li>
            <strong>端末情報:</strong>{" "}
            IPアドレス、ブラウザ種類、アクセス日時、参照元等のアクセスログ
          </li>
          <li>
            <strong>ローカル保存:</strong>{" "}
            お気に入り、投票済み状態等（ユーザーのブラウザ localStorage に保存。当運営のサーバーには送信されません）
          </li>
          <li>
            <strong>Cookie:</strong>{" "}
            管理画面の認証、広告配信（Google AdSense 等）に使用する場合があります
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. 利用目的">
        <p>収集した情報は、以下の目的で利用します。</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>本サービスの提供・運営・改善</li>
          <li>投稿コンテンツの表示、検索、モデレーション（通報対応、不適切コンテンツの削除等）</li>
          <li>不正利用の防止</li>
          <li>広告の配信（第三者広告サービスを利用する場合）</li>
          <li>お問い合わせへの対応</li>
          <li>統計データの作成（個人を特定できない形式）</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. 第三者への提供">
        <p>当運営は、以下の場合を除き、個人情報を第三者に提供しません。</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>ユーザーの同意がある場合</li>
          <li>法令に基づく場合</li>
          <li>人の生命・身体・財産の保護に必要な場合</li>
        </ul>
        <p className="mt-2">
          なお、本サービスでは以下の第三者サービスを利用する場合があります。
          各サービスのプライバシーポリシーもあわせてご確認ください。
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Google AdSense（広告配信）</li>
          <li>ホスティングサービス（Vercel 等）</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. 投稿情報の公開">
        <p>
          ユーザーが投稿した案件情報・コメントは、本サービス上で一般に公開されます。
          招待リンクを含む投稿は、他のユーザーが閲覧・アクセスできる状態となります。
          スクリーンショットに個人情報が含まれないよう、投稿時はご注意ください。
        </p>
      </LegalSection>

      <LegalSection title="5. 保管期間">
        <p>
          投稿データは、本サービスの運営に必要な期間保管します。
          削除・非表示となった投稿、通報データは、運営上必要な期間後に削除する場合があります。
          アクセスログは、通常数ヶ月以内で削除または匿名化します。
        </p>
      </LegalSection>

      <LegalSection title="6. 安全管理">
        <p>
          当運営は、収集した情報の漏洩、滅失、毀損を防止するため、
          合理的な安全管理措置を講じます。ただし、インターネット通信の性質上、
          完全な安全性を保証するものではありません。
        </p>
      </LegalSection>

      <LegalSection title="7. ユーザーの権利">
        <p>
          ご自身の投稿に関する削除依頼、個人情報の取扱いに関するお問い合わせは、
          下記お問い合わせ先までご連絡ください。合理的な範囲で対応いたします。
        </p>
        <p className="mt-2 text-amber-700">
          ※ 現時点では会員登録機能がないため、お気に入り等のブラウザ保存データは
          ユーザーご自身の端末で管理・削除できます。
        </p>
      </LegalSection>

      <LegalSection title="8. 未成年者の利用">
        <p>
          未成年の方が投稿する場合は、保護者の同意を得た上でご利用ください。
          未成年者の個人情報が投稿に含まれないようご注意ください。
        </p>
      </LegalSection>

      <LegalSection title="9. ポリシーの変更">
        <p>
          当運営は、法令の変更やサービス内容の変更に伴い、本ポリシーを改定することがあります。
          重要な変更がある場合は、本サービス上でお知らせします。
        </p>
      </LegalSection>

      <LegalSection title="10. お問い合わせ">
        <p>
          本ポリシーに関するお問い合わせは、下記までご連絡ください。
          <br />
          運営者: {OPERATOR_NAME}
          <br />
          メール:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-violet-600 hover:underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
