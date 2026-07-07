# 飲み会盛り上げAI 実装対応表

**ステータス: Phase 8 完了**

## 機能 → ファイル

| 機能 ID | 機能 | ページ | API | Lib / コンポーネント |
|---------|------|--------|-----|---------------------|
| F21 | Google OAuth | `/login`, `/signup` | `/api/auth/google`, `.../callback` | `oauth.ts`, `GoogleSignInButton.tsx` |
| F28 | LINE ログイン | `/login`, `/signup` | `/api/auth/line`, `.../callback` | `line-oauth.ts` |
| F29 | Apple Sign In | `/login`, `/signup` | `/api/auth/apple`, `.../callback` | `apple-oauth.ts` |
| F30 | 多言語対応 (ja/en) | `/`, `/create`, `/login`, `/signup`, `/my` | `middleware.ts` (`lang` cookie) | `i18n.ts`, `LanguageSwitcher.tsx` |
| F25 | 全員回答済み通知 | `/create` | `join`, `PUT .../participants/[id]` | `notification-service.ts` |
| F26 | イベント OGP | `/e/[slug]` | `GET /api/og/[slug]` | `e/[slug]/page.tsx` |
| F27 | PWA アイコン | — | — | `public/icons/` |

（Phase 1〜5 の対応表は前バージョンと同様）

## 起動

```bash
cd nomikai-ai
npm install
npm run dev
```

## 本番デプロイ

- [DEPLOY.md](./DEPLOY.md) — デプロイ方法概要
- [RENDER_SETUP.md](./RENDER_SETUP.md) — Render 初回セットアップチェックリスト
