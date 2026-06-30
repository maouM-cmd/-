# coupon-board（招待みんなでショータイム）

紹介・招待キャンペーンをみんなで共有する掲示板サイトです。

## クイックスタート

```bash
cd coupon-board
npm install
npm run dev
```

http://localhost:3000 でアクセスできます。

## リポジトリ構成

| パス | 説明 |
|------|------|
| `coupon-board/` | Next.js アプリ本体 |
| `render.yaml` | Render 有料デプロイ用 Blueprint |
| `render.free.yaml` | Render 無料お試し用 Blueprint |
| `.github/workflows/` | CI / デプロイワークフロー |

## ドキュメント

詳細は [coupon-board/README.md](./coupon-board/README.md) を参照してください。

## 新しい GitHub リポジトリへ移行

現在のリモート名が `-` の場合、`coupon-board` という名前のリポジトリを作成して移行できます。

```bash
bash scripts/create-github-repo.sh
```

手動で行う場合は [REPO_SETUP.md](./REPO_SETUP.md) を参照してください。
