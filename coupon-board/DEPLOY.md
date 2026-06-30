# 本番デプロイ手順

招待みんなでショータイムの本番公開ガイド。

> **推奨:** Docker + VPS（SQLite と画像アップロードをそのまま使える）  
> **非推奨:** Vercel 単体（サーバーレスでは `data/` が永続化されない）

---

## 方式比較

| 方式 | 難易度 | SQLite | 画像 | 当環境で検証 |
|------|--------|--------|------|-------------|
| **Render.com** | 低 | ✅ disk | ✅ | Blueprint 用意済み |
| **Docker + VPS** | 中 | ✅ | ✅ | Dockerfile 用意済み |
| ローカル本番 | 低 | ✅ | ✅ | **検証済み** |
| Vercel | 低 | ❌ | ❌ | 非推奨 |

---

## 0. ローカル本番モード（動作確認）

```bash
cd coupon-board
npm run build
npm start
# 別ターミナルで
npm run verify:prod
```

`verify:prod` は全ページ・API のスモークテストを実行します。

---

## A. Render.com（手軽・推奨クラウド）

`render.yaml` を同梱済み。永続ディスクで SQLite・画像を保持できます。

### 手順

1. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
2. GitHub リポジトリを接続
3. **Root Directory** を `coupon-board` に設定
4. 環境変数を設定:
   - `ADMIN_PASSWORD`（必須・強力な値）
   - `NEXT_PUBLIC_CONTACT_EMAIL`
5. **Deploy**

デプロイ後: `https://<your-app>.onrender.com/api/health` で確認

---

## B. Docker + VPS（推奨・フルコントロール）

### 前提

- VPS（Ubuntu 22.04 等）1 台
- ドメイン（任意）
- Docker / Docker Compose インストール済み

### 1. サーバーにコードを配置

```bash
git clone <your-repo-url>
cd coupon-board
```

### 2. 環境変数を設定

```bash
cp .env.example .env.local
nano .env.local
```

**本番で必ず変更:**

```env
ADMIN_PASSWORD=強力なパスワードに変更
NEXT_PUBLIC_OPERATOR_NAME=あなたの運営名
NEXT_PUBLIC_CONTACT_EMAIL=your@email.com

# 広告を使う場合
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT=xxxxxxxx
```

### 3. 起動

```bash
docker compose up -d --build
```

起動確認:

```bash
curl http://localhost:3000/api/health
# {"status":"ok","service":"shotime",...}
```

### 4. リバースプロキシ（Nginx + HTTPS）

Nginx 設定例（`/etc/nginx/sites-available/shotime`）:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 6M;
    }
}
```

HTTPS（Let's Encrypt）:

```bash
sudo certbot --nginx -d your-domain.com
```

### 5. データ永続化

Docker volume `shotime-data` に以下が保存されます:

```
/app/data/coupons.db    # SQLite
/app/data/uploads/      # スクリーンショット
```

**バックアップ例（cron）:**

```bash
docker compose exec app tar czf - /app/data > backup-$(date +%Y%m%d).tar.gz
```

### 6. 更新デプロイ

```bash
git pull
docker compose up -d --build
```

---

## B. ローカルで本番同等環境を試す

```bash
cd coupon-board
cp .env.example .env.local
docker compose up --build
```

ブラウザ: http://localhost:3000

---

## C. Vercel について

現状の構成（`better-sqlite3` + ローカル `data/`）は **Vercel サーバーレスと相性が悪い** です。

| 問題 | 理由 |
|------|------|
| DB が消える | ファイルシステムがエフェメラル |
| 画像が消える | `data/uploads/` が永続化されない |
| native モジュール | `better-sqlite3` のビルド制約 |

Vercel で運用する場合は Phase 2 として以下が必要:

1. DB → [Turso](https://turso.tech/) / PlanetScale / Supabase 等へ移行
2. 画像 → S3 / Cloudflare R2 等へ移行
3. 認証・ストレージ層のリファクタ

現時点では **VPS + Docker を推奨** します。

---

## チェックリスト（本番公開前）

- [ ] `ADMIN_PASSWORD` をデフォルトから変更
- [ ] `NEXT_PUBLIC_CONTACT_EMAIL` を実メールに変更
- [ ] 利用規約・プライバシーの運営者情報を確認
- [ ] HTTPS 有効化
- [ ] `data/` のバックアップ手順を決める
- [ ] 管理画面 `/admin` の URL を関係者のみに共有

---

## トラブルシューティング

### コンテナが起動しない

```bash
docker compose logs -f app
```

### 画像がアップロードできない

- Nginx の `client_max_body_size` を 6M 以上に
- `data/uploads/` の書き込み権限（volume マウント確認）

### DB エラー

```bash
docker compose down
docker volume ls
# shotime-data を確認後、必要ならバックアップから復元
docker compose up -d
```

---

## 関連ドキュメント

- [IMPLEMENTATION.md](./IMPLEMENTATION.md) — 実装構成
- [BASIC_DESIGN.md](./BASIC_DESIGN.md) §11 運用・デプロイ
