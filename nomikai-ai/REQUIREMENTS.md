# 飲み会盛り上げAI 要件定義 v1.8

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

- [x] 多言語対応（日本語 / 英語）— 主要ページ・共通ナビ
  - `lang` クエリ + cookie で locale 切替

## Phase 9 機能

- [x] 多言語対応の完成
  - イベント詳細 `/e/[slug]` / 参加 `/join` / 編集 `/edit`
  - 利用規約 `/terms` / プライバシー `/privacy`
  - 定数ラベル（予算・雰囲気・時間帯）の locale 対応

## スコープ外（Phase 10 候補）

- Render 本番デプロイの実施（課金・人間承認）
