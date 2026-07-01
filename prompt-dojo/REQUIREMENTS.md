# プロンプ道場 要件定義 v9.0

## 概要

プロンプトを書いて、自動構造チェック・LLM評価・コミュニティの星評価でスキルアップする公開Webサービス。

## 確定事項（Phase 1〜9）

| 項目 | 内容 |
|------|------|
| サイト名 | **プロンプ道場** / Prompt Dojo |
| 評価方式 | ルールベース + LLM + 星評価 + コメント（最大5段階スレッド） |
| 認証 | ニックネーム / Google・GitHub・Apple OAuth / メール+パスワード（確認メール必須） |
| 課題管理 | 管理者CRUD + ユーザー投稿（承認制） + AI課題生成 |
| 課題分類 | カテゴリ（4種） + 自由タグ + フィルタ |
| 多言語 UI | 日本語 / 英語（next-intl、`/ja/` `/en/`） |
| 課題コンテンツ i18n | `title_en` / `description_en` / `sample_output_en` + locale 解決 |
| API エラー / 成功 | `errorCode` / `messageCode` + クライアント翻訳 |
| プッシュ通知 | Web Push（VAPID）+ ネイティブ FCM（Capacitor） |
| プッシュ購読解除 | Web / Native 双方の UI + DELETE API |
| プッシュ i18n | 受信者 `preferred_locale` + `/{locale}/` URL |
| ディープリンク | Universal Links / App Links（`.well-known`）+ `prompt-dojo://` |
| オフライン書込 | IndexedDB キュー + `online` イベント + Background Sync |
| LLM | 評価・課題生成が locale に応じた言語で出力 |
| ネイティブシェル | Capacitor WebView v8（`mobile/`） |
| CI | GitHub Actions — lint / vitest / build |
| テスト | vitest（challenge-locale、rate エラーコード） |

## 環境変数

`.env.example` を参照。Phase 8 追加分:

```
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...   # 改行は \n エスケープ

APP_BASE_URL=https://your-domain.example
NEXT_PUBLIC_APP_BASE_URL=https://your-domain.example
```

## Phase 9 実装サマリー

- `challenge-locale.ts` — 課題 DB フィールドの locale 解決
- `challenges` テーブルに `*_en` カラム + seed 英訳 + 既存 DB backfill
- `PushNotifyButton` 購読解除 + `NativePushRegistrar` 責務分離
- `rateSubmission` エラーコード化（`SUBMISSION_NOT_FOUND` 等）
- `.github/workflows/prompt-dojo-ci.yml`
- `mobile/package.json` Capacitor v8 整合
- `vitest` + `.env.example` + README 更新

## スコープ外（Phase 10 候補）

- React Native / Expo ネイティブ UI
- 管理者・ユーザー課題フォームの英語入力欄
- `.well-known` 実値（TEAM_ID / SHA-256）のデプロイ時設定
- 署名済み APK/IPA の CI ビルド
- E2E テスト（Playwright 等）
