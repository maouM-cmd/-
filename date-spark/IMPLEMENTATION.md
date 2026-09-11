# date-spark 実装対応表

**ステータス: 基盤のみ（要件・プロンプト）。本体未着手**

## 機能 → ファイル

| 機能 ID | 機能 | ページ | API | Lib |
|---------|------|--------|-----|-----|
| F01 | 動詞カード即時表示 | `/` | GET `/api/verbs` | `src/lib/db.ts` |
| F02 | ワンクリックスロット3 | `/` | — | seed |
| F03 | 破る（証拠） | `/` | POST `/api/break` | |
| F04 | AI判定 | `/` | POST `/api/verdict` | `src/lib/judge.ts` |
| F05 | health | — | GET `/api/health` | |
| F06 | 解説シアター | `/theater` | — | |
| F07 | 紹介映像 | `/intro` | — | |

## 起動

```bash
cd date-spark
npx --yes create-next-app@16 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
# 既存の README / REQUIREMENTS を消すな。上書き確認が出たら docs は残す
set PORT=3002
npm run dev
```

Next.js 16 の API は `node_modules/next/dist/docs/` を読んでから書く。
