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
  description: `${SITE_NAME}の利用規約`,
};

const LAST_UPDATED = "2026年6月30日";

export default function TermsPage() {
  return (
    <LegalDocument title="利用規約" lastUpdated={LAST_UPDATED}>
      <p>
        本利用規約（以下「本規約」）は、{OPERATOR_NAME}（以下「当運営」）が提供する
        「{SITE_NAME}」（以下「本サービス」）の利用条件を定めるものです。
        本サービスをご利用いただく前に、本規約をよくお読みください。
        本サービスを利用した場合、本規約に同意したものとみなします。
      </p>

      <LegalSection title="第1条（本サービスの内容）">
        <p>
          本サービスは、ユーザーが紹介・招待キャンペーンに関する情報（招待リンク、招待コード、
          特典内容、スクリーンショット等）を投稿・閲覧・検索できる掲示板型のWebサービスです。
        </p>
      </LegalSection>

      <LegalSection title="第2条（利用資格）">
        <ul className="list-disc space-y-1 pl-5">
          <li>日本国内で本規約を理解し、同意できる方</li>
          <li>未成年の方は、保護者の同意を得た上でご利用ください</li>
          <li>過去に本規約違反等により利用停止となった方は除きます</li>
        </ul>
      </LegalSection>

      <LegalSection title="第3条（投稿コンテンツ）">
        <p>ユーザーは、自己の責任においてコンテンツを投稿するものとします。以下の投稿を禁止します。</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>虚偽、誤解を招く、または終了済みのキャンペーン情報</li>
          <li>詐欺、マルチ商法、違法行為、またはそれらを助長する内容</li>
          <li>第三者の権利（著作権、商標権、プライバシー等）を侵害する内容</li>
          <li>個人情報（本人・第三者）が不必要に含まれるスクリーンショット</li>
          <li>わいせつ、差別的、暴力的、または公序良俗に反する内容</li>
          <li>スパム、同一内容の過度な重複投稿</li>
          <li>各サービスの利用規約に反する紹介・勧誘行為</li>
          <li>その他、当運営が不適切と判断する内容</li>
        </ul>
      </LegalSection>

      <LegalSection title="第4条（投稿情報の正確性）">
        <p>
          本サービスに掲載される情報は、投稿ユーザーにより提供されるものであり、
          当運営はその正確性、完全性、最新性、有用性を保証しません。
          招待キャンペーンの利用前には、必ず各サービスの公式サイト・公式アプリで
          最新の条件をご確認ください。
        </p>
      </LegalSection>

      <LegalSection title="第5条（知的財産権）">
        <p>
          本サービスのデザイン、ロゴ、プログラム等に関する権利は当運営または正当な権利者に帰属します。
          ユーザーが投稿したコンテンツの著作権はユーザーに留保されますが、
          ユーザーは当運営に対し、本サービスの運営・表示・宣伝・改善に必要な範囲で
          当該コンテンツを無償で利用する非独占的なライセンスを付与するものとします。
        </p>
      </LegalSection>

      <LegalSection title="第6条（通報・削除）">
        <p>
          当運営は、通報その他の理由により、事前の通知なく投稿の非表示・削除、
          または利用制限を行うことができます。通報が一定数に達した案件は
          自動的に非表示となる場合があります。
        </p>
      </LegalSection>

      <LegalSection title="第7条（広告について）">
        <p>
          本サービスには第三者配信の広告（Google AdSense 等）が表示される場合があります。
          広告内容および広告先のサービスは各広告主の責任となり、
          当運営は広告内容について一切の責任を負いません。
        </p>
      </LegalSection>

      <LegalSection title="第8条（免責事項）">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            本サービスの利用により生じた損害（紹介キャンペーンの不成立、特典未付与、
            第三者サービスとのトラブル等を含む）について、当運営は一切の責任を負いません
          </li>
          <li>本サービスの中断、停止、終了により生じた損害について責任を負いません</li>
          <li>
            当運営の故意または重過失による場合を除き、損害賠償の責任は
            直接かつ現実に生じた通常の損害に限られます
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="第9条（サービスの変更・終了）">
        <p>
          当運営は、ユーザーへの事前通知なく、本サービスの内容変更、一時停止、
          または終了を行うことができます。
        </p>
      </LegalSection>

      <LegalSection title="第10条（規約の変更）">
        <p>
          当運営は、必要に応じて本規約を変更できます。変更後の規約は本サービス上に掲示した時点から
          効力を生じます。変更後に本サービスを利用した場合、変更に同意したものとみなします。
        </p>
      </LegalSection>

      <LegalSection title="第11条（準拠法・管轄）">
        <p>
          本規約は日本法に準拠します。本サービスに関する紛争については、
          当運営の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
        </p>
      </LegalSection>

      <LegalSection title="お問い合わせ">
        <p>
          本規約に関するお問い合わせは、下記までご連絡ください。
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
