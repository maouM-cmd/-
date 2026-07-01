# AI Industry Dashboard Kit — Free Tier

**Build an AI company dashboard in one Cursor session.**

GitHub-first developer kit: structured seed data + TypeScript schemas for Cursor/Claude agents.

## What's included

- **5 companies** — OpenAI, Anthropic, Google DeepMind, Meta AI, Mistral
- Related models, funding rounds, news
- `schemas/types.ts` — shared type contract
- Live demo: [Company Compare](https://your-site.com/tools/compare) *(update URL when deployed)*

## Quick start (5 minutes)

```bash
# 1. Copy data into your Next.js app
cp -r ai-dashboard-kit/free/data your-app/src/data/
cp ai-dashboard-kit/schemas/types.ts your-app/src/lib/ai-types.ts

# 2. Open your app in Cursor
```

**Cursor prompt:**

```
Read src/lib/ai-types.ts and src/data/*.json.

Build a dark-mode AI industry dashboard:
- / — 4 KPI cards (company count, total valuation, model count, avg context)
- /companies — grid with category filters
- /models — comparison table (price, context, open weights)

Stack: Next.js App Router, TypeScript, Tailwind, Recharts.
```

## Full kit

The complete kit (10 companies, requirements doc, component spec, context generator) lives in `ai-dashboard-kit/` at repo root.

Monetization plan: GitHub Sponsors when there is traction — not marketplace-first.

## Repo

- [Kit hub & demo](https://github.com/maouM-cmd/-)
- Direction doc: `docs/DIRECTION.md`

## License

MIT for `free/data/` and `schemas/types.ts`.
