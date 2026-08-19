# とどく 基本設計 v1.0

> 要件: [REQUIREMENTS.md](./REQUIREMENTS.md)

## アーキテクチャ

ブラウザだけで完結する静的アプリ。制度マスタとペルソナは JSON。適合判定は `matchBenefits()` が世帯属性と制度ルールを突合し、スコア・理由・ギャップを返す。

```
Household（3問 or ペルソナ）
        │
        ▼
 matchBenefits(household, benefits)
        │
        ├── eligible: 届く制度（スコア降順）
        └── nearby: 条件が近い参考
```

個人情報は localStorage にも残さない。ペルソナ切替は React state のみ。

## 画面一覧

| パス | 説明 |
|------|------|
| `/` | ヒーロー、ペルソナ、3問フォーム、結果サマリー、制度カード |

## データモデル

### Household

- `householdType`: `single` / `couple` / `single_parent` / `other`
- `children`: `{ age: number }[]`
- `caregiving`: 家族の介護・世話
- `incomeBand`: `low` / `middle` / `high`
- `employment`, `housing`, `disability`, `area`

### Benefit

- 表示: 名称、所管、概要、金額目安、手続URL、手順、出典
- ルール: 子ども要否、年齢幅、世帯タイプ、所得帯、介護、障害、住宅困窮
- インパクト: `timeSavedMinutes`（探す時間の削減）、`annualYenHint`（手取り目安）

### 判定

必須ルールが1つでも外れたら `eligible: false`。適合度は満たした条件の加重平均。理由文はマッチした条件から生成する。
