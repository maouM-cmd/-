# AI Industry Dashboard Kit — Free Tier

Build an AI industry dashboard in one Cursor session.

## What's included (free)

- **5 companies** seed data (OpenAI, Anthropic, Google DeepMind, Meta AI, Mistral)
- Related models, funding rounds, and news
- TypeScript schema (`schemas/types.ts`)
- Live demo: [Company Compare Tool](/tools/compare) on our site

## What's in the paid kit ($39)

- **10 companies** + full dataset
- Requirements doc + component spec
- `generate-claude-context.mjs` — auto-build Claude context file
- `CLAUDE.md` — Cursor agent workflow guide

[Get the full kit →](https://gumroad.com/l/ai-dashboard-kit) | [Product page](/kit)

## Quick start with Cursor

1. Copy free data into your Next.js project:

```bash
cp -r ai-dashboard-kit/free/data your-app/src/data/
cp ai-dashboard-kit/schemas/types.ts your-app/src/lib/ai-types.ts
```

2. Prompt Cursor:

```
Read schemas/types.ts and data/*.json.
Build a dark-mode AI company dashboard with:
- KPI cards on /
- Company grid on /companies
- Model comparison table on /models
Use Next.js App Router + Tailwind + Recharts.
```

## License

Free tier data: MIT. Upgrade to paid for full kit + commercial use of design docs.
