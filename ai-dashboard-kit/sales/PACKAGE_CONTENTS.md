# Paid Package Contents (ZIP structure)

```
ai-dashboard-kit/
├── CLAUDE.md
├── LICENSE.md
├── README.md
├── data/
│   ├── companies.json      # 10 companies
│   ├── models.json         # 10 models
│   ├── funding-rounds.json # 7 rounds
│   └── news.json           # 8 news items
├── docs/
│   ├── REQUIREMENTS.md
│   └── COMPONENT_SPEC.md
├── schemas/
│   └── types.ts
├── scripts/
│   ├── generate-claude-context.mjs
│   └── build-free-tier.mjs
└── sales/
    ├── QUICKSTART.md
    └── GUMROAD_LISTING.md
```

Exclude from paid ZIP:
- `free/` (published separately on GitHub)
- `output/` (generated at runtime)
- `.git/`

## Build ZIP for Gumroad

```bash
cd /path/to/repo
zip -r ai-dashboard-kit-v1.zip ai-dashboard-kit \
  -x "ai-dashboard-kit/free/*" \
  -x "ai-dashboard-kit/output/*" \
  -x "ai-dashboard-kit/.git/*"
```
