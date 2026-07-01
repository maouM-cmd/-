# AI企業ダッシュボード — コンポーネント仕様

## レイアウト

```
┌─────────────────────────────────────────────────┐
│ Header: ロゴ / ナビ / ダークモード切替           │
├──────────┬──────────────────────────────────────┤
│ Sidebar  │ Main Content                         │
│ (desktop)│                                      │
│ - 概要   │                                      │
│ - 企業   │                                      │
│ - モデル │                                      │
│ - 資金   │                                      │
└──────────┴──────────────────────────────────────┘
```

モバイル: Sidebar → ボトムナビ or ハンバーガー

---

## 共通コンポーネント

### `KpiCard`
- **Props**: `label`, `value`, `unit?`, `trend?`, `icon?`
- **表示**: 大きな数値 + ラベル + 前月比（任意）
- **例**: 「追跡企業数 10社」「合計評価額 $3,200B」

### `CompanyCard`
- **Props**: `Company`
- **表示**: ロゴ（頭文字アバター可）、名前、カテゴリバッジ、評価額、主要製品タグ
- **アクション**: クリックで `/companies/[id]` へ

### `ModelRow`
- **Props**: `ModelRelease`, `companyName`
- **表示**: モデル名、会社、リリース日、コンテキスト、入出力価格、オープン/APIバッジ
- **用途**: 比較テーブルの1行

### `FundingTimeline`
- **Props**: `FundingRound[]`, `companies: Record<id, Company>`
- **表示**: 時系列バーチャート or 縦タイムライン
- **色**: ステージごとに色分け

### `NewsFeed`
- **Props**: `NewsItem[]`, `limit?`
- **表示**: 日付、カテゴリバッジ、タイトル（日本語）、要約、外部リンク

### `CategoryBadge`
- **Props**: `CompanyCategory | NewsCategory`
- **色マップ**:
  - foundation_model → 紫
  - enterprise → 青
  - open_source → 緑
  - hardware → オレンジ
  - research → シアン

### `FilterBar`
- **Props**: フィルター定義配列、現在値、onChange
- **種類**: セレクト、チップ（タグ）、検索ボックス

---

## ページ別コンポーネント

### 概要 `/`

| 領域 | コンポーネント | データ |
|------|---------------|--------|
| 上部 | `KpiCard` × 5 | `kpis` |
| 中央左 | `FundingTimeline` | `fundingRounds` |
| 中央右 | `BarChart` カテゴリ別企業数 | `companies` |
| 下部 | `NewsFeed` | `news` (最新5件) |

### 企業一覧 `/companies`

- `FilterBar`（カテゴリ、タグ）
- `CompanyCard` グリッド（3列 desktop / 1列 mobile）
- ソート: 評価額降順デフォルト

### 企業詳細 `/companies/[id]`

- ヘッダー: 企業名、説明、ウェブサイトリンク
- 統計: 評価額、従業員、売上、設立年
- タブ:
  1. **モデル** — 当社の `ModelRelease` 一覧
  2. **資金調達** — 調達履歴テーブル
  3. **競合** — `competitors` の `CompanyCard` リンク

### モデル比較 `/models`

- `FilterBar`（会社、オープンウェイト、API）
- ソート可能テーブル: 名前、会社、コンテキスト、入力$/1M、出力$/1M、MMLU
- ベンチマーク横棒チャート（選択モデル最大5件）

### 資金調達 `/funding`

- 累計調達額 by 会社（横棒）
- `FundingTimeline` 全件
- テーブル: 日付、会社、ステージ、金額、評価額、リード投資家

---

## デザイントークン

```css
/* 推奨カラーパレット（ダークモード基調） */
--bg-primary: #0f1117;
--bg-card: #1a1d27;
--border: #2a2d3a;
--text-primary: #e8eaed;
--text-muted: #9aa0a6;
--accent: #8b5cf6;      /* 紫 — AI/テック感 */
--accent-secondary: #06b6d4;
--success: #22c55e;
--warning: #f59e0b;
```

## 実装の優先順位

1. データ読み込み + 型
2. 概要ページ（KPI + ニュース）
3. 企業一覧・詳細
4. モデル比較
5. 資金調達チャート
6. フィルター・ソート
7. ダークモード・レスポンシブ polish
