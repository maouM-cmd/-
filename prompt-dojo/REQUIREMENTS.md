# プロンプ道場 要件定義 v4.0

## 概要

プロンプトを書いて、自動構造チェック・LLM評価・コミュニティの星評価でスキルアップする公開Webサービス。

## 確定事項（Phase 1〜4）

| 項目 | 内容 |
|------|------|
| サイト名 | **プロンプ道場** |
| 評価方式 | ルールベース + LLM + 星評価 + コメント（最大5段階スレッド） |
| 認証 | ニックネーム / Google・GitHub・Apple OAuth / メール+パスワード（確認メール必須） |
| パスワード | リセットメールによる再設定 |
| 課題管理 | 管理者CRUD + ユーザー投稿（承認制） + AI課題生成 |
| 通知 | Webプッシュ（コメント・評価・課題承認） |
| モデレーション | 通報3件で自動非表示 |
| 収益化 | AdSense 対応枠 |
| PWA | manifest + アイコン + ホーム画面追加対応 |

## 環境変数

```
ADMIN_PASSWORD=...
AUTH_SECRET=...
GOOGLE_CLIENT_ID=... / GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=... / GITHUB_CLIENT_SECRET=...
APPLE_ID=... / APPLE_SECRET=...  # オプション
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
NEXT_PUBLIC_GITHUB_AUTH_ENABLED=true
NEXT_PUBLIC_APPLE_AUTH_ENABLED=true
OPENAI_API_KEY=...
LLM_DAILY_LIMIT=10
LLM_CHALLENGE_GEN_LIMIT=5
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:contact@example.com
APP_BASE_URL=https://your-domain.example
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=noreply@example.com
```

## スコープ外（Phase 5 候補）

- ネイティブアプリ（iOS / Android）
- 課題のタグ・カテゴリ分類
- 多言語対応
- フルオフライン対応
