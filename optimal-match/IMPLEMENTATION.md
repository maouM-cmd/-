# 最適人探し 実装対応表

**ステータス: MVP v1.4 — リアルタイム・OAuth・プッシュ対応**

## 起動

```bash
cd optimal-match
cp env.example .env.local   # 任意
npm install
npm run dev
```

## 画面一覧

| URL | 内容 |
|-----|------|
| `/signup` `/login` | 認証（メール + Google OAuth） |
| `/profile` | プロフィール + 写真 |
| `/discover` | 最適マッチ + フィルター |
| `/match/[id]` | 詳細 + いいね |
| `/matches` | マッチ成立 + いいね一覧 |
| `/chat` | チャット一覧（マッチ相手のみ） |
| `/chat/[userId]` | 1対1チャット（SSEリアルタイム） |
| `/why` | 競合優位性 |
| `/terms` `/privacy` | 法務 |

## API

| API | 機能 |
|-----|------|
| `api/auth/*` | 登録・ログイン・ログアウト |
| `api/auth/google` | Google OAuth 開始 |
| `api/auth/google/callback` | Google OAuth コールバック |
| `api/profile` | プロフィール CRUD |
| `api/profile/photo` | 写真アップロード |
| `api/uploads/[filename]` | 画像配信 |
| `api/likes` | いいね CRUD + 一覧 |
| `api/chat` | チャットスレッド一覧 |
| `api/chat/[userId]` | メッセージ取得・送信 |
| `api/realtime/stream` | SSE リアルタイムイベント |
| `api/push/subscribe` | プッシュ購読登録 |
| `api/matches` | 相性一覧 |
| `api/health` | ヘルスチェック |

## リアルタイム仕様

- SSE (`/api/realtime/stream`) でチャット・マッチイベントを配信
- チャット画面は即時反映、15秒ポーリングはフォールバック

## プッシュ通知

- Service Worker (`public/sw.js`)
- VAPID キー設定時にマッチ成立・新着メッセージを通知

## OAuth

- Google OAuth 2.0（`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `APP_URL`）
- 未設定時はメール認証のみ（ボタン非表示）

## デプロイ

`DEPLOY.md` / `Dockerfile` / `render.yaml` 参照
