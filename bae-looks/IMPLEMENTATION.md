# bae-looks 実装対応表 v0.2

> 要件: [REQUIREMENTS.md](./REQUIREMENTS.md)  
> 設計: [BASIC_DESIGN.md](./BASIC_DESIGN.md)

## 機能 → ファイル

| 機能 | ファイル | 備考 |
|------|----------|------|
| ランディングヒーロー | `src/components/Hero.tsx` | `SITE` 表示。CTA → `#demo` / `#why` |
| 特定デモUI | `src/components/IdentifyDemo.tsx` | Client。phase: `idle` / `scanning` / `ready` |
| 候補カード | `src/components/ItemCard.tsx` | 特徴・根拠・リンク・代替 |
| 確証度バッジ | `src/components/ConfidenceBadge.tsx` | exact / same_brand / similar |
| スコープ説明 | `src/components/WhySection.tsx` | ベイ一人に絞る理由 |
| モックデータ | `src/data/moments.ts` | `DEMO_MOMENTS` + `SITE` |
| 型定義 | `src/lib/types.ts` | `DemoMoment` / `IdentifiedItem` / `ShopLink` 等 |
| グローバルスタイル | `src/app/globals.css` | CSS変数・モーション |
| ルートページ | `src/app/page.tsx` | Hero → IdentifyDemo → WhySection → footer |
| レイアウト / メタ | `src/app/layout.tsx` | Syne + Manrope、`lang="ja"` |
| プロジェクトブリーフ | `../business-ops/briefs/bae-looks-brief.md` | 立ち上げ用 |

## 画面フロー（実装）

```
Hero
  └─ CTA → #demo / #why
IdentifyDemo
  ├─ selectMoment(id) → phase = idle（結果クリア）
  ├─ runIdentify()
  │     → scanning（約1.6s）→ ready + ItemCard[]
  └─ 結果パネル（Agent output preview）
WhySection (#why)
Footer（デモ推測であることの免責）
```

## モックモーメント ID

| id | 注目カテゴリ | 定義箇所 |
|----|--------------|----------|
| `stage-silver` | ピアス | `src/data/moments.ts` |
| `airport-denim` | アウター | 同上 |
| `vlog-lip` | リップ | 同上 |

## ローカル確認

```bash
cd bae-looks
npm install
npm run dev    # http://localhost:3000
npm run lint
npm run build
```

## 既知の制約

- 解析はモック遅延のみ。実動画パイプラインは未接続
- 購入リンクは検索・公式トップ等のプレースホルダ
- 抽象フレーム（`frameTone` グラデ）であり実写ではない
- 商品情報は UX 用デモ推測（実在断定ではない）
