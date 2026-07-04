# 最適人探し 実装対応表

**ステータス: MVP v1.2 — 写真・いいね・デプロイ対応**

## 起動

```bash
cd optimal-match
npm install
npm run dev
```

## 画面一覧

| URL | 内容 |
|-----|------|
| `/signup` `/login` | 認証 |
| `/profile` | プロフィール + 写真 |
| `/discover` | 最適マッチ + フィルター |
| `/match/[id]` | 詳細 + いいね |
| `/matches` | マッチ成立 + いいね一覧 |
| `/why` | 競合優位性 |
| `/terms` `/privacy` | 法務 |

## API

| API | 機能 |
|-----|------|
| `api/auth/*` | 登録・ログイン・ログアウト |
| `api/profile` | プロフィール CRUD |
| `api/profile/photo` | 写真アップロード |
| `api/uploads/[filename]` | 画像配信 |
| `api/likes` | いいね CRUD + 一覧 |
| `api/matches` | 相性一覧 |
| `api/health` | ヘルスチェック |

## デプロイ

`DEPLOY.md` / `Dockerfile` / `render.yaml` 参照
