# 飲み会盛り上げAI 要件定義 v1.3

> 技術設計: [BASIC_DESIGN.md](./BASIC_DESIGN.md) / デプロイ: [DEPLOY.md](./DEPLOY.md)

## Phase 1〜3（完了）

- イベント作成・共有リンク・参加登録・プラン生成
- OpenAI / Anthropic / Google Places / 地図 / プッシュ通知
- Docker + Render デプロイ基盤 / PWA / APP_URL

## Phase 4 機能

- [x] 幹事アカウント（メール + パスワード、任意）
- [x] マイページ `/my`（ログイン幹事のイベント一覧）
- [x] ログイン時のイベント自動紐付け（ゲスト作成も引き続き可能）
- [x] 参加者 `participant_token` による自己編集 `/e/[slug]/edit`
- [x] 幹事による参加者削除・イベント削除
- [x] イベント期限 `expires_at`（30日）・期限切れ read-only 表示
- [x] 参加登録完了時の編集用リンクコピー

## スコープ外（Phase 5）

- Google OAuth ログイン
- 参加者へのプラン確定プッシュ通知
- イベント複製
- Render 本番デプロイの実施（人間作業）
