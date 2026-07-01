# Free Micro Tool — AI Company Compare

## Purpose (SiteGPT model)

A free, SEO-friendly tool that demonstrates kit data quality and funnels users to the paid kit.

## URL

`/tools/compare`

## Features

- Select any 2 of 5 free-tier companies
- Side-by-side: valuation, employees, revenue, latest model, API pricing
- CTA to `/kit` and Gumroad checkout

## Data source

`coupon-board/src/data/ai-companies.json` (synced from `ai-dashboard-kit/free/data/`)

## SEO targets

- "OpenAI vs Anthropic comparison"
- "AI company valuation compare"
- "Mistral vs Meta AI"

## Funnel

```
Google search → /tools/compare → /kit → GitHub clone
```

Revenue (later): GitHub Sponsors, not Gumroad-first.

## Maintenance

When full kit data updates, run:

```bash
node ai-dashboard-kit/scripts/build-free-tier.mjs
cp ai-dashboard-kit/free/data/companies.json coupon-board/src/data/ai-companies.json
cp ai-dashboard-kit/free/data/models.json coupon-board/src/data/ai-models.json
```

## Future extensions

- Add 3-way compare (paid feature teaser)
- Export comparison as PDF (paid)
- Embed widget for dev blogs
