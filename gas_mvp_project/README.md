# ガス会社向け顧客・請求管理ツール（Django MVP雛形）

このディレクトリは、`gas_system_mvp_plan.md` を実装可能な最小構成に落とし込んだ Django 雛形です。

## 実装済み（MVP雛形）
- モデル
  - Customer / Contract / MeterReading / Invoice / Payment / ReceiptIssue
- 管理画面（admin）
  - 各モデルの一覧・検索・フィルタ
- 初期画面遷移
  - `/` ダッシュボード
  - `/customers/` 顧客一覧
  - `/meter-readings/` 検針一覧
  - `/invoices/` 請求一覧
  - `/payments/` 入金管理一覧

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

## 今後の実装候補
- 検針入力フォーム（前回指針自動取得）
- 請求金額自動計算サービス層
- 請求書PDF・領収書PDFの生成
- 入金消込ロジック（部分入金対応）
