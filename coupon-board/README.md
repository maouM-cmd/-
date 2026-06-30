# 招待みんなでショータイム

ロケットなうのような**紹介・招待キャンペーン**をみんなで共有する掲示板サイトです。

## 機能

- **案件一覧** — 新着・人気・紹介者特典順・被紹介者特典順
- **検索・フィルター** — キーワード検索、カテゴリ別絞り込み
- **招待投稿** — 誰でも自分の招待リンク/コードを即時公開（スクショ任意添付）
- **詳細ページ** — 双方の特典表示、スクショ、リンクを開く、コードをコピー、通報、コメント、使えた報告
- **お気に入り** — ブラウザに保存（/favorites）
- **管理画面** — /admin（通報確認・案件の非表示/復活/削除）
- **広告枠** — AdSense 対応（未設定時はプレースホルダ）
- **サンプルデータ** — 初回起動時に5件の案件を自動投入

## 技術スタック

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- SQLite (better-sqlite3)

## セットアップ

```bash
cd coupon-board
npm install
npm run dev
```

http://localhost:3000 でアクセスできます。

## 本番デプロイ

**推奨: Docker + VPS**（SQLite・画像アップロード対応）

```bash
cp .env.example .env.local   # 本番用に編集
docker compose up -d --build
```

詳細は [DEPLOY.md](./DEPLOY.md) を参照してください。

## 要件定義

詳細は以下を参照してください。

- [REQUIREMENTS.md](./REQUIREMENTS.md) — 要件定義
- [BASIC_DESIGN.md](./BASIC_DESIGN.md) — 基本設計書
- [DETAILED_DESIGN.md](./DETAILED_DESIGN.md) — 詳細設計書
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) — 実装対応表（コード配置）

## ページ構成

| パス | 説明 |
|------|------|
| `/` | 案件一覧 |
| `/post` | 招待キャンペーン投稿 |
| `/deal/[id]` | 案件詳細 |
