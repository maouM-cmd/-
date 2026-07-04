# 最適人探し 実装対応表

**ステータス: MVP v1.1 — ログイン・複数ユーザー対応**

## 起動

```bash
cd optimal-match
npm install
npm run dev
```

| URL | 画面 |
|-----|------|
| http://localhost:3000 | トップ |
| /signup | 新規登録 |
| /login | ログイン |
| /profile | プロフィール（要ログイン） |
| /discover | 最適マッチ（要ログイン+プロフィール） |
| /match/[id] | マッチ詳細 |
| /why | 競合優位性 |

## 認証フロー

1. `/signup` でアカウント作成
2. `/profile` でマッチング用プロフィール登録
3. `/discover` でサンプル8名 + 他ユーザーとマッチング

## 機能 → ファイル

| 機能 | ページ | API | Lib |
|------|--------|-----|-----|
| 登録 | `app/signup/page.tsx` | `api/auth/signup` | `db.ts`, `auth.ts` |
| ログイン | `app/login/page.tsx` | `api/auth/login` | 同上 |
| ログアウト | Header | `api/auth/logout` | `session.ts` |
| プロフィール | `app/profile/page.tsx` | `api/profile` | `db.ts` |
| マッチ一覧 | `app/discover/page.tsx` | `api/matches` | `match.ts` |
| マッチ詳細 | `app/match/[id]/page.tsx` | `api/matches/[id]` | `match.ts` |
