# Render デプロイ（3ステップ）

GitHub にマージ済みです。Render にログイン済みなら、あと少しで公開できます。

## 手順 A: Blueprint（初回・推奨）

1. https://dashboard.render.com/blueprints
2. **New Blueprint Instance**
3. リポジトリ `maouM-cmd/coupon-board` を選択（未作成の場合は [REPO_SETUP.md](../REPO_SETUP.md) を参照）
4. `render.yaml`（リポジトリルート）が検出される
5. 環境変数を設定:
   - `ADMIN_PASSWORD` = 強力なパスワード
   - `NEXT_PUBLIC_CONTACT_EMAIL` = あなたのメール
6. **Apply** / **Deploy**

完了後 URL 例: `https://shotime.onrender.com`

## 手順 B: API キーで自動デプロイ（2回目以降）

1. Render → Account Settings → **API Keys** → Create
2. GitHub リポジトリ → Settings → Secrets → Actions:
   - `RENDER_API_KEY` = 上記キー
   - `RENDER_SERVICE_ID` = サービス ID（Dashboard URL の `srv-xxxxx`）
3. `main` に push するたび自動デプロイ

## 動作確認

```
curl https://<your-app>.onrender.com/api/health
```

## 管理画面

`https://<your-app>.onrender.com/admin`  
パスワード = 設定した `ADMIN_PASSWORD`
