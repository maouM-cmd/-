# GitHub Playbook — Developer Kit Distribution

Direction: **GitHub-first**, not marketplace-first.

## Repo structure

```
ai-dashboard-kit/
├── free/           # Public OSS — this is the product demo
│   ├── data/       # 5 companies
│   └── README.md   # Start here
├── data/           # Full 10 companies (public or sponsors-only — your choice)
├── docs/           # Agent specs
├── schemas/
└── scripts/
```

## README checklist (conversion without sales page)

- [ ] One-line value prop above the fold
- [ ] GIF or screenshot of finished dashboard
- [ ] Copy-paste Cursor prompt in a code block
- [ ] `git clone` + 3 commands to first run
- [ ] Link to live demo: `/tools/compare`
- [ ] "Built with Cursor" badge

## Distribution channels (priority order)

| Priority | Channel | Action |
|----------|---------|--------|
| 1 | GitHub README | Make clone → build obvious |
| 2 | Zenn / Qiita | "Built X in 30 min with this kit" |
| 3 | Cursor Forum | Share in "Built with Cursor" thread |
| 4 | Reddit r/cursor | Show don't sell |
| 5 | Hacker News | When you have a working demo URL |
| — | X / note | Skip unless you want to |

## Monetization ladder (later)

| Tier | Price | Delivery |
|------|-------|----------|
| Free | $0 | `free/` on GitHub |
| Sponsor | $5–10/mo | Full data + `generate-claude-context.mjs` via private repo or release |
| Kit #2 | $29 one-time | Conversation coach kit (future) |

## Weekly metrics (private)

Track in a spreadsheet or GitHub Discussions:

- Stars / Forks
- Clone traffic (if GitHub traffic view enabled)
- Article views
- Inbound DMs or Issues

Do not optimize for Gumroad sales.

## Article template (Zenn)

Title: `CursorでAI企業ダッシュボードを30分で作る — キット公開`

1. Problem: starting from blank is slow
2. What's in the kit (screenshot)
3. 3-step quickstart
4. Link to GitHub `free/`
5. What you built (your dashboard screenshot)
6. No hard sell
