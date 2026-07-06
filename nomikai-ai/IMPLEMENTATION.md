# 飲み会盛り上げAI 実装対応表

**ステータス: Phase 3 完了**

## 機能 → ファイル

| 機能 ID | 機能 | ページ | API | Lib |
|---------|------|--------|-----|-----|
| F01 | トップ | `src/app/page.tsx` | — | `src/lib/constants.ts` |
| F02 | イベント作成 | `src/app/create/page.tsx` | `POST /api/events` | `src/lib/db.ts` |
| F03 | イベント詳細 | `src/app/e/[slug]/page.tsx` | `GET /api/events/[slug]` | `EventDetailView.tsx` |
| F04 | 参加登録 | `src/app/e/[slug]/join/page.tsx` | `POST /api/events/[slug]/join` | `JoinEventForm.tsx` |
| F05 | プラン生成 | — | `POST /api/events/[slug]/plan` | `plan-service.ts` |
| F06 | 中間地点 | — | — | `geo.ts` |
| F07 | 店舗（Places） | — | — | `venue-places.ts`, `venue-service.ts` |
| F08 | 盛り上げ（OpenAI） | — | — | `boost-llm.ts` |
| F09 | 盛り上げ（Anthropic） | — | — | `boost-anthropic.ts`, `boost-service.ts` |
| F10 | 地図表示 | — | — | `MapView.tsx` |
| F11 | 幹事プッシュ | — | `POST /api/push/subscribe` | `push.ts`, `public/sw.js` |
| F12 | PWA | — | — | `public/manifest.json`, `layout.tsx` |
| F13 | 本番 URL | — | — | `app-url.ts` |
| F14 | デプロイ | — | `GET /api/health` | `Dockerfile`, `render.yaml` |

## 起動

```bash
cd nomikai-ai
npm install
cp env.example .env.local
npm run dev
```

## 本番デプロイ

[DEPLOY.md](./DEPLOY.md) を参照。

```bash
docker build -t nomikai-ai .
docker run -p 3000:3000 -v nomikai-data:/app/data nomikai-ai
bash scripts/verify-prod.sh
```
