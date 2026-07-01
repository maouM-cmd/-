# プロンプ道場 要件定義 v2.0

## 概要

プロンプトを書いて、自動構造チェック・LLM評価・コミュニティの星評価でスキルアップする公開Webサービス。

## 確定事項（Phase 1 + 2）

| 項目 | 内容 |
|------|------|
| サイト名 | **プロンプ道場** |
| 評価方式 | ルールベース自動採点 + LLM採点（任意） + 星評価 + コメント |
| 認証 | ニックネーム + セッションCookie / Google OAuth |
| 課題管理 | 管理者CRUD + ユーザー投稿（承認制） |
| モデレーション | 通報3件で自動非表示、管理画面で復活・削除 |
| 共有 | 投稿ごとに固有URL、OGP対応 |
| 収益化 | AdSense 対応枠 |

## 機能一覧

- 課題一覧・詳細・ユーザー課題投稿（承認待ち）
- プロンプト入力（リアルタイムルールベースフィードバック）
- LLM自動採点（投稿時、日次上限あり）
- 星評価・コメント・通報
- ランキング（総合 / 自動 / LLM / コミュニティ）
- 投稿履歴
- Google OAuth ログイン
- 管理画面（課題承認・通報・投稿モデレーション）
- 利用規約・プライバシーポリシー

## 環境変数

```
ADMIN_PASSWORD=your-secure-password
AUTH_SECRET=random-secret-string
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
LLM_DAILY_LIMIT=10
NEXT_PUBLIC_SITE_NAME=プロンプ道場
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-...
NEXT_PUBLIC_ADSENSE_SLOT=...
```

## スコープ外（Phase 3）

- メール＋パスワード会員登録
- GitHub / Apple OAuth
- コメントスレッド
- プッシュ通知
