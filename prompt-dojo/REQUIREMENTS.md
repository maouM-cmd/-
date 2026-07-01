# プロンプ道場 要件定義 v6.0

## 概要

プロンプトを書いて、自動構造チェック・LLM評価・コミュニティの星評価でスキルアップする公開Webサービス。

## 確定事項（Phase 1〜6）

| 項目 | 内容 |
|------|------|
| サイト名 | **プロンプ道場** / Prompt Dojo |
| 評価方式 | ルールベース + LLM + 星評価 + コメント（最大5段階スレッド） |
| 認証 | ニックネーム / Google・GitHub・Apple OAuth / メール+パスワード（確認メール必須） |
| パスワード | リセットメールによる再設定 |
| 課題管理 | 管理者CRUD + ユーザー投稿（承認制） + AI課題生成 |
| 課題分類 | カテゴリ（4種） + 自由タグ + フィルタ |
| 多言語 | 日本語 / 英語（next-intl、`/ja/` `/en/`） |
| API エラー | `errorCode` + クライアント `mapApiError()` 翻訳 |
| 法的文書 | 利用規約・プライバシーポリシー日英対応 |
| 通知 | Webプッシュ（コメント・評価・課題承認） |
| モデレーション | 通報3件で自動非表示 |
| 収益化 | AdSense 対応枠 |
| PWA | manifest + アイコン + ホーム画面追加対応 |
| オフライン読取 | 課題一覧・静的アセットの Service Worker キャッシュ |
| オフライン書込 | IndexedDB キュー（投稿・コメント）+ オンライン復帰時同期 |
| ネイティブシェル | Capacitor WebView（`mobile/`、`APP_BASE_URL` を表示） |

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

## Phase 6 実装サマリー

- `src/lib/api-errors.ts` — 全主要 API の `errorCode` 化
- `src/lib/map-api-error.ts` — クライアント翻訳
- `messages/ja.json` / `messages/en.json` — `errors` ネームスペース + 残 UI 文言
- `src/lib/offline-queue.ts` + `OfflineSyncProvider` — オフライン投稿キュー
- `src/components/LegalContent.tsx` — 利用規約・プライバシー英訳
- `mobile/` — Capacitor ネイティブシェル（README 付き）

## スコープ外（Phase 7 候補）

- React Native / Expo によるネイティブ UI 再実装
- プッシュ通知のネイティブ FCM/APNs 統合
- 管理者画面の完全 i18n
- Background Sync API（ブラウザ互換性のため Phase 6 では `online` イベント同期を採用）
