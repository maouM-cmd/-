# ガス会社向け顧客・請求管理ツール（Django MVP）

`gas_system_mvp_plan.md` をベースにした、実運用に寄せたDjango実装です。

## 実装済み機能
- モデル
  - Customer / Contract / MeterReading / Invoice / Payment / ReceiptIssue
- 管理画面（admin）
  - 各モデルの一覧・検索・フィルタ
- 業務画面
  - `/` ダッシュボード
  - `/customers/` 顧客一覧
  - `/meter-readings/` 検針一覧
  - `/meter-readings/new/` 検針入力
  - `/invoices/` 請求一覧
  - `/payments/` 入金管理一覧
  - `/payments/new/<invoice_id>/` 入金登録
- 業務ロジック
  - 検針入力時に使用量を自動計算
  - 検針から請求書を自動作成（単価・基本料金・税計算）
  - 入金登録時に請求ステータスを自動更新（発行済 / 一部入金 / 入金済）

## 起動手順
```bash
cd gas_mvp_project
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## テスト
```bash
cd gas_mvp_project
python manage.py test
```

## 次の実装候補
- 請求書PDF・領収書PDFの生成
- 異常使用量アラート
- 期限超過の自動判定バッチ
- 会計ソフト連携CSV
