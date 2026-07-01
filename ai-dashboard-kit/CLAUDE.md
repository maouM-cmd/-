# Claude 向け作業ガイド — AI企業ダッシュボード

このキットは **Claude で AI企業ダッシュボードを作るときの手助けツール** です。

## 最初にやること

1. このフォルダ `ai-dashboard-kit/` を Claude のプロジェクトにコピー or 参照させる
2. 以下を実行してコンテキストファイルを生成:
   ```bash
   node ai-dashboard-kit/scripts/generate-claude-context.mjs
   ```
3. 生成された `output/CLAUDE_CONTEXT.md` を Claude に読ませる
4. `docs/REQUIREMENTS.md` と `docs/COMPONENT_SPEC.md` を実装の正とする

## ディレクトリ構成

```
ai-dashboard-kit/
├── data/           # シードデータ（JSON）
├── schemas/        # TypeScript型定義
├── docs/           # 要件・コンポーネント仕様
├── scripts/        # コンテキスト生成
├── output/         # 生成物（gitignore）
└── CLAUDE.md       # 本ファイル
```

## Claude への指示テンプレート

以下をコピーして Claude に渡してください:

---

**タスク**: AI企業ダッシュボードを Next.js + TypeScript + Tailwind で作ってください。

**データ**: `ai-dashboard-kit/data/*.json` を使用。型は `schemas/types.ts` に従うこと。

**仕様**:
- `docs/REQUIREMENTS.md` — 画面・KPI・フィルター
- `docs/COMPONENT_SPEC.md` — コンポーネント一覧・デザイントークン

**制約**:
- ダークモード基調のUI
- 日本語UI、企業名は日英併記
- 静的JSONからデータ読み込み（API不要）
- コンポーネント仕様の優先順位に従って段階実装

**最初のステップ**:
1. Next.jsプロジェクト作成
2. 型とデータを `src/lib/` に配置
3. 概要ページ（KPI + ニュース）から着手

---

## データ更新

`data/*.json` を手動編集後、コンテキストを再生成:

```bash
node scripts/generate-claude-context.mjs
```

## 型の使い方

```typescript
import type { Company, DashboardData } from "@/lib/types";
import companies from "@/data/companies.json";
```

JSONをインポートする場合は `tsconfig.json` で `"resolveJsonModule": true` を有効にすること。

## よくある実装パターン

### KPI計算

```typescript
function computeKpis(companies, models, fundingRounds): DashboardKpis {
  const year = new Date().getFullYear();
  return {
    totalCompanies: companies.length,
    totalValuationUsdB: companies
      .filter(c => c.valuationUsdB != null)
      .reduce((s, c) => s + c.valuationUsdB!, 0),
    totalFundingUsdB: fundingRounds.reduce((s, r) => s + r.amountUsdM, 0) / 1000,
    modelsReleasedThisYear: models.filter(m => m.releaseDate.startsWith(String(year))).length,
    avgContextWindowK: /* contextWindowK の平均 */,
  };
}
```

### 企業IDで関連データを取得

```typescript
const companyModels = models.filter(m => m.companyId === id);
const companyFunding = fundingRounds.filter(f => f.companyId === id);
const companyNews = news.filter(n => n.companyId === id);
```

## 注意

- 数値（評価額・調達額）は **2024年末時点の参考値**。本番ではデータ更新が必要
- NVIDIAはハードウェア企業だがAIインフラの観点で含めている
- `google-deepmind` と `meta-ai` は親会社上場のため `valuationUsdB: null`
