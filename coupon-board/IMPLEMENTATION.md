# 招待みんなでショータイム 実装対応表

詳細設計（[DETAILED_DESIGN.md](./DETAILED_DESIGN.md)）とソースコードの対応関係。

**ステータス: MVP v1.2 実装済み**

---

## 起動

```bash
cd coupon-board
npm install
npm run dev
```

| URL | 画面 |
|-----|------|
| http://localhost:3000 | 一覧 |
| http://localhost:3000/post | 投稿 |
| http://localhost:3000/admin | 管理（PW: `shotime-admin`） |
| http://localhost:3000/favorites | お気に入り |

---

## 機能 → 実装ファイル

| 機能 ID | 機能 | ページ | API | DB / Lib |
|---------|------|--------|-----|----------|
| F01 | 案件一覧 | `app/page.tsx` | `api/deals/route.ts` GET | `lib/db.ts` `getAllDeals` |
| F02 | 案件詳細 | `app/deal/[id]/page.tsx` | `api/deals/[id]/route.ts` GET | `getDealById` |
| F03 | 案件投稿 | `app/post/page.tsx` + `DealForm.tsx` | `api/deals/route.ts` POST | `createDeal` |
| F04 | スクショ | `DealForm.tsx` | POST (multipart) | `lib/upload.ts` |
| F05 | 役に立った | `HelpfulButton.tsx` | `api/deals/[id]` PATCH | `incrementHelpful` |
| F06 | 使えた報告 | `UsageReportButtons.tsx` | `api/deals/[id]/usage` | `incrementUsage` |
| F07 | コメント | `CommentSection.tsx` | `api/deals/[id]/comments` | `createComment` |
| F08 | お気に入り | `FavoriteButton.tsx`, `FavoritesList.tsx` | GET `?ids=` | `lib/favorites.ts` |
| F09 | 通報 | `ReportButton.tsx` | `api/deals/[id]/report` | `createReport` |
| F10 | 管理画面 | `AdminDashboard.tsx` | `api/admin/*` | `lib/admin.ts` |
| F11 | 広告 | `AdSlot.tsx` | — | env 変数 |
| F12 | 利用規約 | `app/terms/page.tsx` | — | `LegalDocument.tsx` |
| F13 | プライバシー | `app/privacy/page.tsx` | — | 同上 |

---

## 画面 → コンポーネント構成

### `/` 一覧

```
layout.tsx (Header, Footer)
└── page.tsx
    ├── AdSlot
    ├── SearchFilter
    └── DealCard × n
```

### `/deal/[id]` 詳細

```
deal/[id]/page.tsx
├── AdSlot (top)
├── UsageReportButtons
├── CopyCodeButton / FavoriteButton / HelpfulButton
├── CommentSection
├── ReportButton
└── AdSlot (bottom)
```

### `/post` 投稿

```
post/page.tsx
└── DealForm
```

---

## API ルート一覧（実装済み）

```
src/app/api/
├── deals/
│   ├── route.ts              GET, POST
│   └── [id]/
│       ├── route.ts          GET, PATCH
│       ├── comments/route.ts GET, POST
│       ├── report/route.ts   POST
│       └── usage/route.ts    POST
├── uploads/[filename]/route.ts GET
└── admin/
    ├── route.ts              GET
    ├── login/route.ts        POST, DELETE
    └── deals/[id]/route.ts   PATCH
```

---

## データ層

| ファイル | 責務 |
|----------|------|
| `lib/db.ts` | SQLite 接続・CRUD・シード |
| `lib/types.ts` | TypeScript 型 |
| `lib/constants.ts` | カテゴリ・サイト名 |
| `lib/constants-reports.ts` | 通報理由 |
| `lib/upload.ts` | 画像保存（サーバー専用） |
| `lib/screenshot.ts` | 画像 URL 生成（クライアント可） |
| `lib/favorites.ts` | localStorage 操作 |
| `lib/admin.ts` | 管理認証 Cookie |

**DB ファイル:** `data/coupons.db`（自動生成）  
**画像:** `data/uploads/`（自動生成）

---

## 未実装（Phase 2）

| 項目 | 状態 |
|------|------|
| 会員登録・ログイン | 未実装 |
| 投稿の編集・削除（ユーザー） | 未実装 |
| レートリミット | 未実装 |
| 自動テスト | 未実装 |
| 外部 DB / S3 | 未実装（SQLite + ローカルファイル） |

---

## 本番デプロイ時の注意

**→ [DEPLOY.md](./DEPLOY.md) に手順を記載（Docker + VPS 推奨）**

Vercel 等のサーバーレスでは `data/` が永続化されない。本番運用時は以下いずれかが必要:

1. VPS + 永続ディスク
2. Turso / PlanetScale 等への DB 移行
3. 画像を S3 / R2 等へ移行

---

## 改訂履歴

| 版 | 日付 | 内容 |
|----|------|------|
| v1.0 | 2026-06-30 | 初版（MVP v1.2 実装準拠） |
