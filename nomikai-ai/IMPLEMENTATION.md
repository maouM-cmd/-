# 飲み会盛り上げAI 実装対応表

**ステータス: Phase 4 完了**

## 機能 → ファイル

| 機能 ID | 機能 | ページ | API | Lib |
|---------|------|--------|-----|-----|
| F16 | 幹事ログイン | `/login`, `/signup` | `/api/auth/*` | `auth.ts`, `session.ts` |
| F17 | マイページ | `/my` | — | `db.ts` (getEventsByUserId) |
| F18 | 参加者編集 | `/e/[slug]/edit` | `PUT .../participants/[id]` | `ParticipantEditForm.tsx` |
| F19 | 参加者/イベント削除 | — | `DELETE .../participants/[id]`, `DELETE .../[slug]` | `EventDetailView.tsx` |
| F20 | イベント期限 | — | — | `event-expiry.ts` |

（Phase 1〜3 の対応表は前バージョンと同様）

## 起動

```bash
cd nomikai-ai
npm install
npm run dev
```

## 本番デプロイ

[DEPLOY.md](./DEPLOY.md) を参照。
