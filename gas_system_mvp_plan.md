# ガス会社向け顧客管理・請求管理ツール MVP 提案

## 前提（スキルレベル別の進め方）
依頼文では開発者スキルが未確定のため、3つのレベルで最適解を提示します。

- **レベルA: プログラミング未経験〜初学者**
- **レベルB: Pythonを少し触れる**
- **レベルC: Web開発経験あり**

結論として、最短で成功率が高い順は以下です。
1. レベルA: NoCode（Airtable + Softr / Glide）
2. レベルB: Django（Python）
3. レベルC: Next.js + Supabase

---

## 1. 推奨テックスタック（技術選定）

### 推奨案（本命）: **Python（Django）+ PostgreSQL + さくらVPS もしくは ConoHa VPS**
「Pythonは少し触れる」想定で、最も保守性と開発速度のバランスがよい構成です。

- **言語**: Python
- **Webフレームワーク**: Django
  - 管理画面が強力で、顧客・検針・請求・入金のCRUDを短期間で実装可能
  - 権限管理、認証、フォーム検証が標準で堅牢
- **DB**: PostgreSQL
  - 将来の帳票・集計にも強い
  - トランザクション・整合性が高い
- **フロントUI**:
  - 初期は Django Template + Bootstrap（シンプルで十分）
  - ボタンと入力導線を大きくし、業務フロー順の画面配置にする
- **PDF**:
  - WeasyPrint または wkhtmltopdf
  - A4請求書・領収書テンプレートを固定フォーマットで生成
- **サーバー**:
  - 小規模なら 2GB メモリVPSで開始（低ランニングコスト）
  - Nginx + Gunicorn + PostgreSQL
- **バックアップ**:
  - DB日次バックアップ（自動）+ 請求書PDFの週次バックアップ
  - バックアップ先は別ストレージ（クラウドオブジェクトストレージ等）

#### この構成が良い理由
- 業務システムで必要な「入力の確実性」「履歴管理」「帳票出力」を実現しやすい
- 初期のUIを作り込み過ぎず、まず請求業務を回せる
- 将来、口座振替データ連携や会計ソフト連携にも拡張しやすい

### 代替案（超短期）: **NoCode（Airtable + Softr / Glide）**
- メリット: 1〜2週間でプロトタイプ可能
- デメリット: 請求ロジック・税率改定・帳票自由度・インボイス対応で限界が来やすい
- 推奨するケース: 「まず運用を回し、要件を固める」フェーズ限定

### 代替案（開発経験あり向け）: **Next.js + Supabase**
- メリット: モダン、将来の拡張や外部連携に強い
- デメリット: 学習コストが高く、MVP完成までの工数が増える

### セキュリティ最低ライン（必須）
- 全通信HTTPS
- 操作ユーザーごとのID/PW（共通アカウント禁止）
- 顧客情報アクセスの監査ログ
- DBとPDFバックアップ暗号化
- 退職/担当変更時のアカウント失効手順

---

## 2. データベース設計（ER図の概要）

MVPのコアは以下の6テーブルです。

### 2-1. `customers`（顧客）
- `id` (PK)
- `customer_code`（顧客番号、ユニーク）
- `name`
- `name_kana`
- `postal_code`
- `address1`
- `address2`
- `phone`
- `billing_method`（現金/振込/口座振替）
- `is_active`
- `created_at`
- `updated_at`

### 2-2. `contracts`（契約情報）
- `id` (PK)
- `customer_id` (FK -> customers.id)
- `plan_name`
- `base_fee`（基本料金）
- `unit_price`（従量単価）
- `tax_rate`（通常10%）
- `tax_rounding_rule`（四捨五入/切り捨て/切り上げ）
- `invoice_registration_no`（適格請求書発行事業者番号）
- `start_date`
- `end_date`（NULL可）
- `created_at`
- `updated_at`

> 単価改定に備えて、顧客と契約を分離するのが重要です。

### 2-3. `meter_readings`（検針）
- `id` (PK)
- `customer_id` (FK)
- `reading_month`（YYYY-MM、請求対象月）
- `current_value`（今月指針）
- `previous_value`（前回指針、確定値コピー）
- `usage_amount`（使用量 = current - previous）
- `measured_at`（検針日）
- `input_user_id`（入力担当）
- `note`
- `created_at`
- `updated_at`
- **Unique制約**: (`customer_id`, `reading_month`)

### 2-4. `invoices`（請求）
- `id` (PK)
- `invoice_no`（請求番号、ユニーク）
- `customer_id` (FK)
- `meter_reading_id` (FK)
- `issue_date`（発行日）
- `due_date`（支払期限）
- `base_fee_amount`
- `usage_fee_amount`
- `subtotal_amount`（税抜合計）
- `tax_amount`
- `total_amount`（税込請求額）
- `tax_rate`
- `status`（issued/paid/overdue/cancelled）
- `pdf_path`
- `created_at`
- `updated_at`

### 2-5. `payments`（入金）
- `id` (PK)
- `invoice_id` (FK -> invoices.id)
- `payment_date`
- `payment_amount`
- `payment_method`
- `received_by`
- `reference_no`（振込番号等）
- `note`
- `created_at`

### 2-6. `receipt_issues`（領収書発行履歴）
- `id` (PK)
- `payment_id` (FK)
- `receipt_no`（領収書番号）
- `issued_at`
- `pdf_path`
- `created_at`

### 関係（ERの口頭表現）
- Customers 1 --- N Contracts
- Customers 1 --- N MeterReadings
- Customers 1 --- N Invoices
- MeterReadings 1 --- 1 Invoices（MVPでは1対1推奨）
- Invoices 1 --- N Payments（分割入金にも対応）
- Payments 1 --- N ReceiptIssues（再発行にも対応）

---

## 3. 画面遷移図・機能一覧（迷わないUI）

### 基本方針
- 「業務順」で並べる（顧客 → 検針 → 請求 → 入金）
- 1画面1目的
- 文字大きめ、主要ボタンを固定位置

### 画面遷移（MVP）
1. **ログイン**
2. **ホーム（本日の作業）**
   - 「今月未検針件数」「未発行請求件数」「未入金件数」を表示
3. **顧客一覧** → **顧客詳細** → **契約編集**
4. **検針入力一覧（当月）** → **検針入力フォーム**
   - 顧客選択 → 今月指針入力 → 使用量自動計算表示
5. **請求作成一覧**
   - 未請求の検針データを一覧表示
   - 一括請求書作成
6. **請求詳細**
   - 請求書PDF出力
7. **入金管理一覧**
   - 入金登録（全額/一部）
   - 消込ステータス更新
8. **領収書発行**
   - 入金データから領収書PDF生成

### 最低限の機能一覧
- 顧客登録/編集/停止
- 契約プラン設定（基本料・単価・税率）
- 検針入力と使用量自動計算
- 請求金額自動計算（税額含む）
- 請求書PDF発行
- 入金消込（未入金/一部入金/入金済）
- 領収書PDF発行
- 月次一覧CSV出力（会計連携用）

### UX上の工夫（両親向け）
- 「前回値」は自動表示（手入力させない）
- 異常値アラート（例: 前月比+200%以上）
- 主要操作に確認ダイアログ
- 削除より「無効化」を優先（事故防止）

---

## 4. 開発ロードマップ（挫折しない順序）

### フェーズ0（1週間）: 要件固定
- 現在の紙運用をヒアリングし、画面モックを手書きでも作る
- 請求書フォーマット（印字項目）を先に確定
- 税計算ルール（端数処理）を確定

### フェーズ1（1〜2週間）: 土台構築
- Djangoプロジェクト作成
- ログイン/ユーザー権限
- Customers / Contracts モデル作成
- 管理画面から基本データ登録できる状態にする

### フェーズ2（1〜2週間）: 検針と料金計算
- MeterReadings 入力画面
- 前回指針の自動取得
- 使用量計算とバリデーション
- 請求金額計算ロジック（ユニットテスト必須）

### フェーズ3（1〜2週間）: 請求・入金
- Invoices 生成（単票/一括）
- PDF請求書出力
- Payments 登録と消込
- 未入金一覧

### フェーズ4（1週間）: 領収書・運用機能
- 領収書PDF
- 月次集計画面
- CSV出力
- 操作ログ

### フェーズ5（1週間）: 本番導入
- テストデータで1か月分のリハーサル
- データバックアップの自動化
- 操作マニュアル（A4数ページ）作成
- 両親向けの30分トレーニングを2回実施

### 挫折回避の実践ポイント
- 先に「完璧なUI」を作らない
- まずは「請求書を1件正しく出せる」ことをゴール化
- 毎週デモして、要望を1〜2個だけ反映
- 会計連携や自動引落連携はMVP後に回す

---

## 初期見積り（目安）
- MVP開発期間: **6〜10週間**（平日夜 + 週末開発想定）
- 初期費用: ほぼ0円（自作）
- ランニング: VPS + ドメイン + バックアップで **月2,000〜5,000円程度**

## まず最初の一歩
1. 既存の請求書・検針票をスマホで撮影して要素分解
2. 本ドキュメントのテーブル定義で「必須項目」を確定
3. Djangoで Customers 画面だけ作る
4. 実データ10件入力して運用感を確認
