# プロンプ道場 要件定義 v8.0

## 概要

プロンプトを書いて、自動構造チェック・LLM評価・コミュニティの星評価でスキルアップする公開Webサービス。

## 確定事項（Phase 1〜8）

| 項目 | 内容 |
|------|------|
| サイト名 | **プロンプ道場** / Prompt Dojo |
| 評価方式 | ルールベース + LLM + 星評価 + コメント（最大5段階スレッド） |
| 認証 | ニックネーム / Google・GitHub・Apple OAuth / メール+パスワード（確認メール必須） |
| パスワード | リセットメールによる再設定 |
| 課題管理 | 管理者CRUD + ユーザー投稿（承認制） + AI課題生成 |
| 課題分類 | カテゴリ（4種） + 自由タグ + フィルタ |
| 多言語 | 日本語 / 英語（next-intl、`/ja/` `/en/`） |
| API エラー / 成功 | `errorCode` / `messageCode` + クライアント翻訳 |
| プッシュ通知 | Web Push（VAPID）+ ネイティブ FCM（Capacitor） |
| プッシュ i18n | 受信者 `preferred_locale` + `/{locale}/` URL |
| ディープリンク | Universal Links / App Links（`.well-known`）+ `prompt-dojo://` |
| オフライン書込 | IndexedDB キュー + `online` イベント + Background Sync |
| LLM | 評価・課題生成が locale に応じた言語で出力 |
| ネイティブシェル | Capacitor WebView（`mobile/`） |

## 環境変数

```
# 既存（認証・LLM・VAPID・SMTP 等）は v7.0 参照

# Phase 8: ネイティブ FCM（任意 — 未設定時は Web Push のみ）
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...   # 改行は \n エスケープ

APP_BASE_URL=https://your-domain.example
NEXT_PUBLIC_APP_BASE_URL=https://your-domain.example
```

## Phase 8 実装サマリー

- `push-messages.ts` — プッシュ文言・URL の locale 対応
- `device_tokens` テーブル + `/api/push/register-device` + `firebase-admin` FCM 送信
- `NativePushRegistrar` + Capacitor push/app プラグイン
- `capacitor-deeplink.ts` + `.well-known`（AASA / assetlinks）
- Background Sync（`sw.js` + `registerBackgroundSync()`）
- LLM evaluator / challenge generator の locale 対応

## スコープ外（Phase 9 候補）

- React Native / Expo ネイティブ UI
- 課題コンテンツ DB 多言語カラム（seed 英訳）
- ネイティブプッシュ購読解除 UI
- CI 署名済み APK/IPA ビルド
