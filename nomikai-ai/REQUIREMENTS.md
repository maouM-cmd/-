# 飲み会盛り上げAI 要件定義 v1.2

> 技術設計: [BASIC_DESIGN.md](./BASIC_DESIGN.md) / デプロイ: [DEPLOY.md](./DEPLOY.md)

## 概要

幹事が共有リンクを1本送るだけで、全員の予定・場所の真ん中・店の指定・盛り上げプランがスマホで見られる Web アプリ。

## Phase 1〜2（完了）

- [x] イベント作成・共有リンク・参加登録
- [x] 中間地点・店候補・盛り上げプラン自動生成
- [x] OpenAI / Google Places / 地図 / 幹事プッシュ通知

## Phase 3 機能

- [x] Docker + Render 本番デプロイ基盤（`Dockerfile`, `render.yaml`, `DEPLOY.md`）
- [x] GitHub Actions 自動デプロイ workflow（Secrets 設定時）
- [x] `APP_URL` による本番絶対 URL（プッシュ通知）
- [x] PWA（manifest + ホーム画面追加対応）
- [x] Anthropic Claude 盛り上げアダプター
- [x] 本番 smoke test（`scripts/verify-prod.sh`）

## スコープ外（Phase 4）

- 会員登録・ログイン（幹事アカウント）
- 参加者の編集・削除
- イベント期限・自動アーカイブ

## 人間承認が必要な作業

- Render Starter プランでの本番デプロイ（課金）
- 環境変数・API キーの Render Dashboard 設定
