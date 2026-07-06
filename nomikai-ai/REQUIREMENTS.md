# 飲み会盛り上げAI 要件定義 v1.4

> 技術設計: [BASIC_DESIGN.md](./BASIC_DESIGN.md) / デプロイ: [DEPLOY.md](./DEPLOY.md) / Render初回: [RENDER_SETUP.md](./RENDER_SETUP.md)

## Phase 1〜4（完了）

- イベント作成・共有リンク・参加登録・プラン生成
- OpenAI / Anthropic / Google Places / 地図 / 幹事向けプッシュ通知
- Docker + Render デプロイ基盤 / PWA / APP_URL
- 幹事アカウント（メール + パスワード）/ マイページ / 参加者自己編集 / 削除・期限

## Phase 5 機能

- [x] Google OAuth ログイン（メール/パスワードと共存）
- [x] 参加者へのプラン確定プッシュ通知
- [x] イベント複製（テンプレート再作成）
- [x] Render 本番デプロイ手順（[RENDER_SETUP.md](./RENDER_SETUP.md) — 人間作業）

## スコープ外（Phase 6 候補）

- LINE ログイン / Apple Sign In
- 幹事への「全員回答済み」自動通知
- イベント共有用 OGP 画像
- 多言語対応
- Render 本番デプロイの実施（課金・人間承認）
