# 飲み会盛り上げAI 実装対応表

**ステータス: Phase 5 完了**

## 機能 → ファイル

| 機能 ID | 機能 | ページ | API | Lib / コンポーネント |
|---------|------|--------|-----|---------------------|
| F16 | 幹事ログイン | `/login`, `/signup` | `/api/auth/*` | `auth.ts`, `session.ts` |
| F17 | マイページ | `/my` | — | `db.ts`, `MyEventsList.tsx` |
| F18 | 参加者編集 | `/e/[slug]/edit` | `PUT .../participants/[id]` | `ParticipantEditForm.tsx` |
| F19 | 参加者/イベント削除 | — | `DELETE .../participants/[id]`, `DELETE .../[slug]` | `EventDetailView.tsx` |
| F20 | イベント期限 | — | — | `event-expiry.ts` |
| F21 | Google OAuth | `/login`, `/signup` | `/api/auth/google`, `.../callback` | `oauth.ts`, `GoogleSignInButton.tsx` |
| F22 | 参加者プッシュ | `/e/[slug]` | `POST /api/push/subscribe` | `ParticipantPushPrompt.tsx`, `push.ts` |
| F23 | プラン確定通知 | — | `POST .../plan` | `push.ts` (`sendPushToParticipants`) |
| F24 | イベント複製 | `/my`, `/e/[slug]` | `POST .../clone` | `db.ts` (`cloneEvent`) |

（Phase 1〜3 の対応表は前バージョンと同様）

## 起動

```bash
cd nomikai-ai
npm install
npm run dev
```

## 本番デプロイ

- [DEPLOY.md](./DEPLOY.md) — デプロイ方法概要
- [RENDER_SETUP.md](./RENDER_SETUP.md) — Render 初回セットアップチェックリスト
