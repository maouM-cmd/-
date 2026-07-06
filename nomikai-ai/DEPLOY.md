# 本番デプロイ手順 — 飲み会盛り上げAI

## 前提

- Render アカウント（https://render.com）
- **課金:** Starter プラン + 1GB ディスクで月額約 $7〜10（要確認）
- SQLite は `/app/data` に永続化（ディスク必須）

## 方法A: Render Blueprint（推奨）

1. Render Dashboard → **New** → **Blueprint**
2. このリポジトリを接続（Root Directory: `nomikai-ai`）
3. `nomikai-ai/render.yaml` を検出してデプロイ
4. 環境変数を設定（下表参照）
5. デプロイ完了後、公開 URL で動作確認

## 方法B: Docker 手動

```bash
cd nomikai-ai
docker build -t nomikai-ai .
docker run -p 3000:3000 -v nomikai-data:/app/data nomikai-ai
```

## 方法C: GitHub Actions（既存シークレット）

リポジトリ Secrets に以下を設定:

| Secret | 内容 |
|--------|------|
| `RENDER_API_KEY` | Render API キー |
| `NOMAIKAI_AI_RENDER_SERVICE_ID` | nomikai-ai サービス ID |

`main` マージで `.github/workflows/nomikai-ai-deploy.yml` が自動デプロイ。

## デプロイ後チェック

```bash
PORT=3000 bash scripts/verify-prod.sh
```

- [ ] `/api/health` が `{"status":"ok"}`
- [ ] トップ → 飲み会作成 → 参加登録 → プラン生成
- [ ] スマホでホーム画面に追加（PWA）
- [ ] データが再起動後も残る（ディスクマウント確認）

## 環境変数（Render Dashboard）

| 変数 | 必須 | 用途 |
|------|------|------|
| `APP_URL` | 推奨 | 公開 URL（プッシュ通知・絶対リンク） |
| `OPENAI_API_KEY` | 任意 | AI 盛り上げ（OpenAI） |
| `ANTHROPIC_API_KEY` | 任意 | AI 盛り上げ（Anthropic） |
| `GOOGLE_MAPS_API_KEY` | 任意 | Places 店舗検索 |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | 任意 | 地図 Embed |
| `VAPID_PUBLIC_KEY` | 任意 | Web Push 公開鍵 |
| `VAPID_PRIVATE_KEY` | 任意 | Web Push 秘密鍵 |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | 任意 | クライアント用公開鍵 |
| `VAPID_SUBJECT` | 任意 | `mailto:you@example.com` |

VAPID 生成:

```bash
npx web-push generate-vapid-keys
```

## 注意

- **無料プラン**はディスク非永続のため非推奨（データ消失）
- 本番では HTTPS が Render により自動付与
- API キー未設定時はテンプレートベースで動作

## ローカル本番相当

```bash
npm run build
npm run start
```
