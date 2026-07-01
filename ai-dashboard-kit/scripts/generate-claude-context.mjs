#!/usr/bin/env node
/**
 * Claude向けコンテキストファイルを一括生成する
 *
 * Usage: node scripts/generate-claude-context.mjs
 * Output: output/CLAUDE_CONTEXT.md
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "output");

function readJson(name) {
  return JSON.parse(readFileSync(join(ROOT, "data", name), "utf-8"));
}

function readText(...parts) {
  return readFileSync(join(ROOT, ...parts), "utf-8");
}

function computeKpis(companies, models, fundingRounds) {
  const year = new Date().getFullYear();
  const valuations = companies
    .map((c) => c.valuationUsdB)
    .filter((v) => v != null);
  const contexts = models
    .map((m) => m.contextWindowK)
    .filter((v) => v != null);

  return {
    totalCompanies: companies.length,
    totalValuationUsdB: valuations.reduce((s, v) => s + v, 0),
    totalFundingUsdB:
      fundingRounds.reduce((s, r) => s + r.amountUsdM, 0) / 1000,
    modelsReleasedThisYear: models.filter((m) =>
      m.releaseDate.startsWith(String(year))
    ).length,
    avgContextWindowK:
      contexts.length > 0
        ? Math.round(contexts.reduce((s, v) => s + v, 0) / contexts.length)
        : 0,
  };
}

function formatCompanySummary(companies) {
  return companies
    .map(
      (c) =>
        `- **${c.nameJa}** (${c.id}): 評価額 $${c.valuationUsdB ?? "—"}B, ${c.employees ?? "—"}人, [${c.categories.join(", ")}]`
    )
    .join("\n");
}

function formatModelTable(models, companies) {
  const byId = Object.fromEntries(companies.map((c) => [c.id, c.name]));
  const header =
    "| モデル | 会社 | リリース | コンテキスト | 入力$/1M | 出力$/1M | オープン |\n|--------|------|----------|-------------|----------|----------|----------|";
  const rows = models.map((m) => {
    const mmlu = m.benchmarkScores.find((b) => b.name === "MMLU");
    return `| ${m.name} | ${byId[m.companyId] ?? m.companyId} | ${m.releaseDate} | ${m.contextWindowK ?? "—"}K | ${m.inputPricePer1M ?? "—"} | ${m.outputPricePer1M ?? "—"} | ${m.openWeights ? "✓" : "—"} |`;
  });
  return [header, ...rows].join("\n");
}

function main() {
  const companies = readJson("companies.json");
  const models = readJson("models.json");
  const fundingRounds = readJson("funding-rounds.json");
  const news = readJson("news.json");
  const kpis = computeKpis(companies, models, fundingRounds);

  const requirements = readText("docs", "REQUIREMENTS.md");
  const componentSpec = readText("docs", "COMPONENT_SPEC.md");
  const types = readText("schemas", "types.ts");

  const md = `# AI企業ダッシュボード — Claude コンテキスト

> 自動生成: ${new Date().toISOString()}
> このファイルをClaudeに読ませてダッシュボード実装を開始してください。

---

## クイックサマリー

| KPI | 値 |
|-----|-----|
| 追跡企業数 | ${kpis.totalCompanies} |
| 合計評価額 | $${kpis.totalValuationUsdB.toFixed(1)}B |
| 累計調達額 | $${kpis.totalFundingUsdB.toFixed(1)}B |
| 今年のモデルリリース | ${kpis.modelsReleasedThisYear} |
| 平均コンテキスト長 | ${kpis.avgContextWindowK}K |

## 企業一覧

${formatCompanySummary(companies)}

## モデル比較表

${formatModelTable(models, companies)}

## 最新ニュース（全件）

${news.map((n) => `- **${n.date}** [${n.category}] ${n.titleJa} — ${n.summary}`).join("\n")}

---

## 要件定義

${requirements}

---

## コンポーネント仕様

${componentSpec}

---

## TypeScript型定義

\`\`\`typescript
${types}
\`\`\`

---

## 生データ（JSON）

### companies.json

\`\`\`json
${JSON.stringify(companies, null, 2)}
\`\`\`

### models.json

\`\`\`json
${JSON.stringify(models, null, 2)}
\`\`\`

### funding-rounds.json

\`\`\`json
${JSON.stringify(fundingRounds, null, 2)}
\`\`\`

### news.json

\`\`\`json
${JSON.stringify(news, null, 2)}
\`\`\`
`;

  mkdirSync(OUT_DIR, { recursive: true });
  const outPath = join(OUT_DIR, "CLAUDE_CONTEXT.md");
  writeFileSync(outPath, md, "utf-8");

  const bundlePath = join(OUT_DIR, "dashboard-data.json");
  writeFileSync(
    bundlePath,
    JSON.stringify(
      { companies, models, fundingRounds, news, kpis, generatedAt: new Date().toISOString() },
      null,
      2
    ),
    "utf-8"
  );

  console.log(`✓ Generated: ${outPath}`);
  console.log(`✓ Generated: ${bundlePath}`);
  console.log(`  Companies: ${companies.length}, Models: ${models.length}, Funding: ${fundingRounds.length}, News: ${news.length}`);
}

main();
