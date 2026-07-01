# Quick Start (Paid Kit)

## 1. Unzip and generate context

```bash
cd ai-dashboard-kit
node scripts/generate-claude-context.mjs
```

Output:
- `output/CLAUDE_CONTEXT.md` — paste into Claude/Cursor
- `output/dashboard-data.json` — bundled data

## 2. Open in Cursor

```bash
cursor .
```

Add `CLAUDE.md` rules to your project or reference `output/CLAUDE_CONTEXT.md` in your first prompt.

## 3. Recommended prompt

```
You are building an AI industry dashboard.

Read output/CLAUDE_CONTEXT.md for full requirements, component spec, and data.

Stack: Next.js 15+ App Router, TypeScript, Tailwind, Recharts, dark mode.

Build in this order:
1. Layout with sidebar nav
2. Dashboard / with 5 KPI cards
3. /companies grid with filters
4. /companies/[id] detail page
5. /models comparison table
6. /funding timeline chart

Import data from data/*.json. Use schemas/types.ts for all types.
```

## 4. Deploy

```bash
npm run build
# Vercel, Docker, or your preferred host
```

## 5. Optional: Product Hunt

Use the landing page at `/kit` on your site. Link Gumroad checkout from the CTA.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Script fails | Node 18+ required |
| Types mismatch | Regenerate context after editing `data/*.json` |
| Cursor ignores spec | Attach `CLAUDE_CONTEXT.md` explicitly with @ |
