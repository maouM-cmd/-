# AI Dashboard Kit — Gumroad出品監査

## 既存資産（`ai-dashboard-kit/`）

| 資産 | 状態 | Gumroad価値 |
|------|------|------------|
| `data/companies.json` | 10社・日英併記・評価額等 | 高 |
| `data/models.json` | 10モデル・価格・ベンチマーク | 高 |
| `data/funding-rounds.json` | 7ラウンド | 中 |
| `data/news.json` | 8件ニュース | 中 |
| `schemas/types.ts` | 完全なTypeScript契約 | 高 |
| `docs/REQUIREMENTS.md` | 画面・KPI・技術スタック | 高 |
| `docs/COMPONENT_SPEC.md` | 全コンポーネント仕様 | 高 |
| `scripts/generate-claude-context.mjs` | CLAUDE_CONTEXT.md自動生成 | 最高（差別化） |
| `CLAUDE.md` | Cursor/Claude向け作業ガイド | 高 |

**強み:** 「プロンプト集」ではなく、エージェントが1セッションでダッシュボードを組み立てるための**構造化データ + 設計書 + コンテキスト生成器**。

## Gumroad出品として不足していたもの（本実装で追加）

| 不足 | 対応 |
|------|------|
| 無料版/有料版の切り分け | `free/` ディレクトリ + `docs/FREE_PAID_SPLIT.md` |
| Gumroad商品説明文 | `sales/GUMROAD_LISTING.md` |
| ライセンス明記 | `LICENSE.md` |
| セットアップ動画代替（スクショ手順） | `sales/QUICKSTART.md` |
| 競合比較表 | `docs/COMPETITOR_SCAN.md` |
| 販売LP | `coupon-board/src/app/kit/page.tsx` |
| SEO集客用デモツール | `coupon-board/src/app/tools/compare/page.tsx` |
| 無料版ビルドスクリプト | `scripts/build-free-tier.mjs` |

## 推奨価格

- **$39**（約5,800円）— Gumroad分析の$29〜49帯、競合SaaS boilerplate（$49〜100）より安くポジション

## 出品チェックリスト

- [x] 有料版ZIP構成定義（`sales/PACKAGE_CONTENTS.md`）
- [x] 無料版GitHub公開用データ（5社）
- [x] LP + 購入リンクプレースホルダ
- [ ] Gumroadアカウント作成・商品登録（手動）
- [ ] Product Huntローンチ（手動）
- [ ] GitHub公開リポジトリ作成（手動）
