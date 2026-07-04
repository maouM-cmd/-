# 本番デプロイ手順 — 最適人探し

## 前提

- Render アカウント（https://render.com）
- **課金:** Starterプラン + 1GBディスクで月額約 $7〜10（要確認）
- SQLite・写真は `/app/data` に永続化（ディスク必須）

## 方法A: Render Blueprint（推奨）

1. Render Dashboard → **New** → **Blueprint**
2. このリポジトリを接続
3. `optimal-match/render.yaml` を検出してデプロイ
4. 初回デプロイ完了後、URLで動作確認

## 方法B: Docker手動

```bash
cd optimal-match
docker build -t optimal-match .
docker run -p 3000:3000 -v om-data:/app/data optimal-match
```

## 方法C: GitHub Actions（既存シークレット）

リポジトリ Secrets に以下を設定:

| Secret | 内容 |
|--------|------|
| `RENDER_API_KEY` | Render APIキー |
| `OPTIMAL_MATCH_RENDER_SERVICE_ID` | optimal-match サービスID |

`main` マージで `.github/workflows/optimal-match-deploy.yml` が自動デプロイ。

## デプロイ後チェック

- [ ] `/api/health` が `{"status":"ok"}`
- [ ] サインアップ → プロフィール → 写真アップロード
- [ ] いいね → `/matches` で確認
- [ ] データが再起動後も残る（ディスクマウント確認）

## 注意

- **無料プラン**はディスク非永続のため非推奨（データ消失）
- 本番では HTTPS が Render により自動付与
- パスワードは scrypt ハッシュで保存（平文なし）

## ローカル本番相当

```bash
npm run build
npm run start
```
