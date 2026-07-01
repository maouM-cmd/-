#!/usr/bin/env node
/**
 * 無料版（GitHub公開用）データを本番データから生成
 * Usage: node scripts/build-free-tier.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const FREE_DIR = join(ROOT, "free", "data");

const FREE_COMPANY_IDS = new Set([
  "openai",
  "anthropic",
  "google-deepmind",
  "meta-ai",
  "mistral",
]);

function readJson(name) {
  return JSON.parse(readFileSync(join(ROOT, "data", name), "utf-8"));
}

function writeFreeJson(name, data) {
  writeFileSync(join(FREE_DIR, name), JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function main() {
  const companies = readJson("companies.json").filter((c) =>
    FREE_COMPANY_IDS.has(c.id)
  );
  const models = readJson("models.json").filter((m) =>
    FREE_COMPANY_IDS.has(m.companyId)
  );
  const fundingRounds = readJson("funding-rounds.json").filter((r) =>
    FREE_COMPANY_IDS.has(r.companyId)
  );
  const news = readJson("news.json").filter((n) =>
    FREE_COMPANY_IDS.has(n.companyId)
  );

  mkdirSync(FREE_DIR, { recursive: true });
  writeFreeJson("companies.json", companies);
  writeFreeJson("models.json", models);
  writeFreeJson("funding-rounds.json", fundingRounds);
  writeFreeJson("news.json", news);

  console.log(`✓ Free tier: ${companies.length} companies, ${models.length} models`);
  console.log(`  Output: ${FREE_DIR}/`);
}

main();
