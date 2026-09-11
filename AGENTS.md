# AGENTS.md

This repository is a monorepo containing several independent projects:

- `coupon-board/` — Next.js 16 web app (招待キャンペーン掲示板). Standalone npm project.
- `optimal-match/` — Next.js 16 web app (最適人探し matching MVP). Standalone npm project.
- `date-spark/` — ハッカソン#24 デートマンネリ解消（制作基盤。本体は Claude Code が `business-ops/templates/prompts/hackathon-24/01-claude-mvp.md` を貼って実装）。PORT=3002。optimal-match はフォークしない。
- `ai-dashboard-kit/` — data/schemas/docs plus one Node context-generator script (`scripts/generate-claude-context.mjs`), no dependencies.
- `business-ops/` — Node automation/workflow scripts (`scripts/*.mjs`), no dependencies.
- `articles/` — markdown content only (not runnable).

Per-project docs (READMEs, design docs) are the source of truth for each app. Each web app also has its own `AGENTS.md` noting that Next.js 16 has breaking changes — read `node_modules/next/dist/docs/` before writing Next.js code.

## Cursor Cloud specific instructions

- The two web apps are **not** an npm workspace. Each has its own `package.json` / `package-lock.json` and must be installed/run independently from inside its own directory. The startup update script already runs `npm ci` for both.
- Standard scripts live in each app's `package.json`: `npm run dev` (dev server), `npm run lint`, `npm run build`. CI (`.github/workflows/*-ci.yml`) runs `npm ci` → `npm run lint` → `npm run build`.
- Both apps default to **port 3000**. To run them at the same time, start one with a `PORT` override, e.g. `PORT=3001 npm run dev` for `optimal-match`. Each exposes a health check at `/api/health`.
- Both apps use `better-sqlite3` (a native module). The SQLite database file lives under each app's `data/` directory, which is git-ignored and **auto-created and seeded on first run** — no manual migration step. `coupon-board` seeds 5 sample deals; `optimal-match` seeds sample profiles so `/discover` is populated for a brand-new account.
- `optimal-match` runs fully with email/password auth out of the box. Google OAuth and Web Push are optional and stay disabled unless the vars in `optimal-match/env.example` are set; no `.env.local` is required for local dev.
- The helper scripts in `business-ops/` and `ai-dashboard-kit/` run with plain `node` and need no dependency install. `ai-dashboard-kit` writes generated output to its git-ignored `output/` directory.
