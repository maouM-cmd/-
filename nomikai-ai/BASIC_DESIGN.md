# 飲み会盛り上げAI 基本設計 v1.0

> 要件: [REQUIREMENTS.md](./REQUIREMENTS.md)

## システム構成

```mermaid
flowchart TB
  subgraph Client["クライアント（スマホブラウザ）"]
    UI[Next.js Pages]
  end
  subgraph Server["サーバー"]
    API[API Routes]
    Lib[geo / venue / boost]
    DB[(SQLite)]
  end
  subgraph External["外部（Phase 1）"]
    HR[HeartRails Express API]
  end
  UI --> API
  API --> Lib
  API --> DB
  Lib --> HR
```

## 画面一覧

| パス | 説明 |
|------|------|
| `/` | トップ・サービス説明 |
| `/create` | イベント作成フォーム |
| `/e/[slug]` | イベント詳細・プラン表示・幹事操作 |
| `/e/[slug]/join` | 参加者入力フォーム |
| `/e/[slug]/edit` | 参加者の回答編集（participant_token） |
| `/login` | 幹事ログイン |
| `/signup` | 幹事新規登録 |
| `/my` | マイページ（ログイン幹事のイベント一覧） |
| `/terms` | 利用規約 |
| `/privacy` | プライバシーポリシー |

## データモデル

- **users / sessions**: 幹事アカウント（任意ログイン）
- **events**: イベント本体（slug, edit_token, organizer_user_id, expires_at）
- **participants**: 参加者（名前, 最寄駅, participant_token）
- **plans**: 生成プラン（中間駅, 店候補 JSON, 盛り上げ JSON）

## API

| Method | Path | 用途 |
|--------|------|------|
| POST | `/api/events` | イベント作成 |
| GET | `/api/events/[slug]` | イベント取得 |
| POST | `/api/events/[slug]/join` | 参加者追加 |
| POST | `/api/events/[slug]/plan` | プラン生成（edit_token 必須） |
| PUT | `/api/events/[slug]/participants/[id]` | 参加者更新（participant_token） |
| DELETE | `/api/events/[slug]/participants/[id]` | 参加者削除 |
| DELETE | `/api/events/[slug]` | イベント削除（edit_token） |
| POST | `/api/auth/signup` | 幹事登録 |
| POST | `/api/auth/login` | ログイン |
| GET | `/api/health` | ヘルスチェック |
