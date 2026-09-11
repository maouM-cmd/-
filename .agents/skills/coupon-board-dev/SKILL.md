---
name: coupon-board-dev
description: 招待キャンペーン掲示板（coupon-board）の開発・修正・デプロイ。Next.js 16の破壊的変更に注意し、設計書を正とする。
---

# coupon-board 開発 Skill

## いつ使うか

- `coupon-board/` の機能追加・バグ修正
- デプロイ前の検証
- 設計書と実装の整合確認

## 必ず読む参照（この順）

1. `coupon-board/AGENTS.md` — **Next.js 16は学習データと異なる。必ず node_modules 内ドキュメントを確認**
2. `coupon-board/REQUIREMENTS.md` — 要件の正
3. `coupon-board/DETAILED_DESIGN.md` — 詳細設計
4. `coupon-board/IMPLEMENTATION.md` — 機能→ファイル対応表
5. 変更対象の既存ソース

## 技術スタック

| 項目 | 内容 |
|------|------|
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Style | Tailwind CSS |
| DB | SQLite (better-sqlite3) |
| Deploy | Render / Docker / ローカル |

## ローカル開発

```bash
cd coupon-board
npm install
npm run dev
# http://localhost:3000
```

| URL | 用途 |
|-----|------|
| `/` | 一覧 |
| `/post` | 投稿 |
| `/admin` | 管理（PW: shotime-admin ※本番では必ず変更） |
| `/favorites` | お気に入り |

## 変更時のルール

1. **スコープ最小** — 依頼と無関係なリファクタ禁止
2. **設計書更新** — 仕様変更時は REQUIREMENTS / DETAILED_DESIGN / IMPLEMENTATION を同期
3. **既存パターン踏襲** — `src/lib/`, `src/components/`, `src/app/api/` の構成を維持
4. **Next.js 16** — `node_modules/next/dist/docs/` を参照してから API 使用

## デプロイ前チェック（必須）

```bash
bash business-ops/scripts/pre-deploy-check.sh
```

または手動:

```bash
cd coupon-board
npm run lint
npm run build
bash scripts/verify-prod.sh  # 可能な場合
```

## 人間承認が必要な操作

| 操作 | 理由 |
|------|------|
| `git push origin main` | 本番デプロイが自動トリガーされる |
| Render シークレット変更 | 認証・課金 |
| 管理画面パスワード変更 | セキュリティ（本番必須） |
| DBスキーマ破壊的変更 | データ消失 |
| `render.yaml` / 課金プラン変更 | コスト発生 |

## CI

- PR/push to `cursor/**` or `main` → lint + build（`coupon-board/**` 変更時）
- main マージ + Render secrets 設定時 → 自動デプロイ

## 実装パターン

### 新APIルート

```
src/app/api/{resource}/route.ts
src/lib/db.ts にクエリ追加
src/lib/types.ts に型追加
IMPLEMENTATION.md に行追加
```

### 新コンポーネント

```
src/components/{Name}.tsx
既存コンポーネントの命名・propsパターンに合わせる
```

## プロンプト例

```
@coupon-board-dev

{機能ID or 要件} を実装してください。
- IMPLEMENTATION.md の対応表を更新すること
- lint/build が通ること
- 本番デプロイは行わないこと
```
