# 最適人探し 実装対応表

**ステータス: MVP v1.0 実装済み**

## 起動

```bash
cd optimal-match
npm install
npm run dev
```

| URL | 画面 |
|-----|------|
| http://localhost:3000 | トップ |
| /profile | プロフィール登録 |
| /discover | 最適マッチ一覧 |
| /match/[id] | マッチ詳細 |

## 機能 → ファイル

| 機能 | ページ | API | Lib |
|------|--------|-----|-----|
| トップ | `app/page.tsx` | — | `db.ts` |
| プロフィール | `app/profile/page.tsx` | `api/profile` | `db.ts` |
| マッチ一覧 | `app/discover/page.tsx` | `api/matches` | `match.ts` |
| マッチ詳細 | `app/match/[id]/page.tsx` | `api/matches/[id]` | `match.ts` |
