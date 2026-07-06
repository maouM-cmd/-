# 飲み会盛り上げAI 要件定義 v1.5

> 技術設計: [BASIC_DESIGN.md](./BASIC_DESIGN.md) / デプロイ: [DEPLOY.md](./DEPLOY.md) / Render初回: [RENDER_SETUP.md](./RENDER_SETUP.md)

## Phase 1〜5（完了）

- イベント作成・共有リンク・参加登録・プラン生成
- OpenAI / Anthropic / Google Places / 地図 / プッシュ通知
- Docker + Render デプロイ基盤 / PWA / APP_URL
- 幹事アカウント（メール + パスワード + Google OAuth）
- 参加者プラン確定プッシュ / イベント複製

## Phase 6 機能

- [x] Phase 5 バグ修正（幹事URLコピー、push購読スコープ、clone認可）
- [x] 幹事への「全員回答済み」自動通知（想定参加人数）
- [x] イベント共有用 OGP 画像（`generateMetadata` + `/api/og/[slug]`）
- [x] PWA アイコン（`public/icons/`）

## スコープ外（Phase 7 候補）

- LINE ログイン / Apple Sign In
- 多言語対応
- Render 本番デプロイの実施（課金・人間承認）
