# bae-looks 実装対応表 v0.3

> 要件: [REQUIREMENTS.md](./REQUIREMENTS.md)  
> 設計: [BASIC_DESIGN.md](./BASIC_DESIGN.md)

## 機能 → ファイル

| 機能 | ファイル | 備考 |
|------|----------|------|
| ランディングヒーロー | `src/components/Hero.tsx` | CTA → `#context` / `#demo` |
| コンテキストボード | `src/components/ContextBoard.tsx` | 物 / 興味 / 場所タブ |
| 興味カード | `src/components/InterestCard.tsx` | 発言引用＋出典 |
| 場所カード | `src/components/PlaceCard.tsx` | 訪問ログ＋地図 |
| 特定デモUI | `src/components/IdentifyDemo.tsx` | phase: idle / scanning / ready |
| 候補カード | `src/components/ItemCard.tsx` | 特徴・根拠・リンク・代替 |
| 確証度バッジ | `src/components/ConfidenceBadge.tsx` | exact / same_brand / similar |
| スコープ説明 | `src/components/WhySection.tsx` | 物・興味・場所の骨格 |
| モーメントモック | `src/data/moments.ts` | `DEMO_MOMENTS` + `SITE` |
| コンテキストモック | `src/data/context.ts` | items / interests / places |
| 型定義 | `src/lib/types.ts` | item / interest / place |
| グローバルスタイル | `src/app/globals.css` | CSS変数・モーション |
| ルートページ | `src/app/page.tsx` | Hero → ContextBoard → IdentifyDemo → Why |

## 画面フロー

```
Hero
  └─ CTA → #context / #demo
ContextBoard (#context)
  ├─ tab: 物 → ItemCard[]
  ├─ tab: 興味 → InterestCard[]
  └─ tab: 場所 → PlaceCard[]
IdentifyDemo (#demo)
  └─ moment select → scan → ItemCard[]
WhySection (#why)
Footer
```

## ローカル確認

```bash
cd bae-looks
npm install
npm run dev
npm run lint
npm run build
```

## 既知の制約

- 解析はモックのみ。実動画・字幕パイプラインは未接続
- 興味・場所もデモデータ（実在の断定ではない）
- 購入・地図リンクはプレースホルダ
