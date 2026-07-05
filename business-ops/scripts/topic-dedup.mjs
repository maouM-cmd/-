#!/usr/bin/env node
/**
 * 既存記事とのトピック重複チェック（簡易）
 *
 * Usage:
 *   node business-ops/scripts/topic-dedup.mjs --query "AI 副業 効率化"
 *   node business-ops/scripts/topic-dedup.mjs --list
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = join(__dirname, "../../articles");

function parseTitle(content) {
  const fm = content.match(/^---[\s\S]*?title:\s*"?([^"\n]+)"?/);
  if (fm) return fm[1].replace(/^\*+|\*+$/g, "").trim();
  const h2 = content.match(/^## (.+)$/m);
  return h2 ? h2[1].trim() : "(unknown)";
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\u3040-\u30ff\u4e00-\u9fff\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2);
}

function jaccard(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  const inter = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : inter / union;
}

function loadArticles() {
  if (!existsSync(ARTICLES_DIR)) return [];
  return readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const content = readFileSync(join(ARTICLES_DIR, f), "utf-8");
      const title = parseTitle(content);
      return { file: f, title, tokens: tokenize(title + " " + content.slice(0, 500)) };
    });
}

function main() {
  const args = process.argv.slice(2);
  const articles = loadArticles();

  if (args.includes("--list")) {
    for (const a of articles) console.log(`${a.file}\t${a.title}`);
    return;
  }

  const qIdx = args.indexOf("--query");
  if (qIdx === -1 || !args[qIdx + 1]) {
    console.log("Usage: topic-dedup.mjs --query \"キーワード\" | --list");
    process.exit(1);
  }

  const queryTokens = tokenize(args[qIdx + 1]);
  const scored = articles
    .map((a) => ({ ...a, score: jaccard(queryTokens, a.tokens) }))
    .sort((x, y) => y.score - x.score);

  console.log(`Query: "${args[qIdx + 1]}"\n`);
  for (const s of scored.slice(0, 5)) {
    const bar = s.score >= 0.3 ? "⚠️  HIGH" : s.score >= 0.15 ? "△ MED" : "  LOW";
    console.log(`${bar} ${(s.score * 100).toFixed(0)}%  ${s.file}`);
    console.log(`       ${s.title}\n`);
  }
}

main();
