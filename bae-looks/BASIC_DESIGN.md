# bae-looks 基本設計 v0.1

> 要件: [REQUIREMENTS.md](./REQUIREMENTS.md)

## アーキテクチャ

```
Browser
  └─ Next.js App Router (CSR demo island)
       ├─ Hero / WhySection (Server Components)
       ├─ IdentifyDemo (Client: moment select + scan UX)
       └─ data/moments.ts (mock moments + items)
```

将来拡張時は `IdentifyDemo` のモック遅延を API（フレーム抽出→検出→検索）に差し替える。

## 画面構成

1. **Hero** — ブランド BAE FRAME を第一ビューの主役に
2. **Demo** — モーメント3種 → スキャン演出 → 結果カード
3. **Why** — ベイ一人に絞る理由（拡張方針の説明）

## データモデル

- `DemoMoment`: シーン・タイムスタンプ・フォーカスカテゴリ・候補配列
- `IdentifiedItem`: ブランド/型番候補・視覚特徴・確証度・リンク・代替

## 確証度

| 値 | UI |
|----|-----|
| `exact` | 完全一致 |
| `same_brand` | 同一ブランド |
| `similar` | 類似デザイン |
