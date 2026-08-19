# とどく 実装対応表

**ステータス: MVP 実装済み**

## 機能 → ファイル

| 機能 ID | 機能 | ページ | API | Lib / Data |
|---------|------|--------|-----|------------|
| F01 | ペルソナ3種ワンクリック | `/` | なし | `src/data/personas.json`, `PersonaPicker.tsx` |
| F02 | 世帯3問フォーム | `/` | なし | `HouseholdForm.tsx`, `src/lib/types.ts` |
| F03 | 制度マッチング | `/` | なし | `src/lib/match.ts` |
| F04 | 制度カード・サマリー | `/` | なし | `BenefitCard.tsx`, `ResultSummary.tsx` |
| F05 | 制度マスタ | — | なし | `src/data/benefits.json` |
| F06 | 提出文案 | — | なし | `SUBMIT.md` |

## 起動

```bash
cd todoku
npm install
npm run dev
```
