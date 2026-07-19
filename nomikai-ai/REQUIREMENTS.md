# 飲み会盛り上げAI 要件定義 v1.7

> 技術設計: [BASIC_DESIGN.md](./BASIC_DESIGN.md) / デプロイ: [DEPLOY.md](./DEPLOY.md) / Render初回: [RENDER_SETUP.md](./RENDER_SETUP.md)

## Phase 1〜6（完了）

- イベント作成・共有・プラン生成 / AI盛り上げ / 地図 / プッシュ通知
- 幹事アカウント（メール + Google OAuth）/ マイページ / 参加者編集
- 参加者プラン確定プッシュ / イベント複製
- 全員回答済み通知 / OGP / PWA アイコン

## Phase 7 機能

- [x] LINE ログイン（メール/パスワード・Googleと共存）
- [x] Apple Sign In（同上）

## Phase 8 機能

- [x] 多言語対応（日本語 / 英語）
  - `lang` クエリ + cookie で locale 切替
  - 主要ページ（トップ / create / login / signup / my）と共通ナビを英語対応

## スコープ外（Phase 9 候補）

- Render 本番デプロイの実施（課金・人間承認）
