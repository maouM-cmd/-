# 飲み会盛り上げAI 実装対応表

**ステータス: MVP 完了**

## 機能 → ファイル

| 機能 ID | 機能 | ページ | API | Lib |
|---------|------|--------|-----|-----|
| F01 | トップ・サービス説明 | `src/app/page.tsx` | — | `src/lib/constants.ts` |
| F02 | イベント作成 | `src/app/create/page.tsx` | `POST /api/events` | `src/lib/db.ts` |
| F03 | イベント詳細・幹事操作 | `src/app/e/[slug]/page.tsx` | `GET /api/events/[slug]` | `src/components/EventDetailView.tsx` |
| F04 | 参加登録 | `src/app/e/[slug]/join/page.tsx` | `POST /api/events/[slug]/join` | `src/components/JoinEventForm.tsx` |
| F05 | プラン生成 | — | `POST /api/events/[slug]/plan` | `src/lib/plan-service.ts` |
| F06 | 中間地点算出 | — | — | `src/lib/geo.ts` |
| F07 | 店舗候補生成 | — | — | `src/lib/venue.ts` |
| F08 | 盛り上げコンテンツ生成 | — | — | `src/lib/boost.ts` |
| F09 | コピー UI | — | — | `src/components/CopyCard.tsx` |
| F10 | 店舗カード | — | — | `src/components/VenueCard.tsx` |
| F11 | ヘルスチェック | — | `GET /api/health` | — |
| F12 | 利用規約・プライバシー | `src/app/terms/page.tsx`, `privacy/page.tsx` | — | `src/components/LegalDocument.tsx` |

## 起動

```bash
cd nomikai-ai
npm install
npm run dev
```

## CI

`.github/workflows/nomikai-ai-ci.yml`
