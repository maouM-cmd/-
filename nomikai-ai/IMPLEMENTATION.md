# 飲み会盛り上げAI 実装対応表

**ステータス: Phase 2 完了**

## 機能 → ファイル

| 機能 ID | 機能 | ページ | API | Lib |
|---------|------|--------|-----|-----|
| F01 | トップ・サービス説明 | `src/app/page.tsx` | — | `src/lib/constants.ts` |
| F02 | イベント作成 | `src/app/create/page.tsx` | `POST /api/events` | `src/lib/db.ts` |
| F03 | イベント詳細・幹事操作 | `src/app/e/[slug]/page.tsx` | `GET /api/events/[slug]` | `src/components/EventDetailView.tsx` |
| F04 | 参加登録 | `src/app/e/[slug]/join/page.tsx` | `POST /api/events/[slug]/join` | `src/components/JoinEventForm.tsx` |
| F05 | プラン生成 | — | `POST /api/events/[slug]/plan` | `src/lib/plan-service.ts` |
| F06 | 中間地点算出 | — | — | `src/lib/geo.ts` |
| F07 | 店舗候補（テンプレート） | — | — | `src/lib/venue.ts` |
| F08 | 店舗候補（Places） | — | — | `src/lib/venue-places.ts`, `venue-service.ts` |
| F09 | 盛り上げ（テンプレート） | — | — | `src/lib/boost.ts` |
| F10 | 盛り上げ（LLM） | — | — | `src/lib/boost-llm.ts`, `boost-service.ts` |
| F11 | 地図表示 | — | — | `src/components/MapView.tsx` |
| F12 | 生成ソース表示 | — | — | `src/components/SourceBadge.tsx` |
| F13 | 幹事プッシュ通知 | — | `GET/POST /api/push/subscribe` | `src/lib/push.ts`, `public/sw.js` |
| F14 | コピー UI | — | — | `src/components/CopyCard.tsx` |
| F15 | ヘルスチェック | — | `GET /api/health` | — |

## 環境変数

`env.example` を参照。すべてオプション（未設定時は Phase 1 テンプレートにフォールバック）。

## 起動

```bash
cd nomikai-ai
npm install
cp env.example .env.local  # API キーを設定
npm run dev
```
