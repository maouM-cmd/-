# 飲み会盛り上げAI 実装対応表

**ステータス: Phase 6 完了**

## 機能 → ファイル

| 機能 ID | 機能 | ページ | API | Lib / コンポーネント |
|---------|------|--------|-----|---------------------|
| F21 | Google OAuth | `/login`, `/signup` | `/api/auth/google`, `.../callback` | `oauth.ts`, `GoogleSignInButton.tsx` |
| F22 | 参加者プッシュ | `/e/[slug]` | `POST /api/push/subscribe` | `ParticipantPushPrompt.tsx`, `push.ts` |
| F23 | プラン確定通知 | — | `POST .../plan` | `push.ts` (`sendPushToParticipants`) |
| F24 | イベント複製 | `/my`, `/e/[slug]` | `POST .../clone` | `db.ts` (`cloneEvent`) |
| F25 | 全員回答済み通知 | `/create` | `join`, `PUT .../participants/[id]` | `notification-service.ts` |
| F26 | イベント OGP | `/e/[slug]` | `GET /api/og/[slug]` | `e/[slug]/page.tsx` (`generateMetadata`) |
| F27 | PWA アイコン | — | — | `public/icons/`, `favicon.ico` |

（Phase 1〜4 の対応表は前バージョンと同様）

## 起動

```bash
cd nomikai-ai
npm install
npm run dev
```

## 本番デプロイ

- [DEPLOY.md](./DEPLOY.md) — デプロイ方法概要
- [RENDER_SETUP.md](./RENDER_SETUP.md) — Render 初回セットアップチェックリスト
