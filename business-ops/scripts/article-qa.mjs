#!/usr/bin/env node
/**
 * 記事の機械QA — フロントマター・必須セクション・CTAを検証
 *
 * Usage:
 *   node business-ops/scripts/article-qa.mjs articles/foo.md
 *   node business-ops/scripts/article-qa.mjs --all
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const ARTICLES_DIR = join(ROOT, "articles");

const REQUIRED_FRONTMATTER = ["title", "emoji", "type", "topics", "published"];
const REQUIRED_BODY_KEYWORDS = [
  "密かにやっている3つのこと",
  "なぜ効くのか",
  "具体的にやること",
  "実践例",
  "すぐできる一歩",
];
const PROBLEM_SECTION_PATTERNS = [
  "なぜ多くの人が",
  "明確な理由があります",
  "上手くいかない",
];
const CTA_PATTERNS = [
  "🎁 コピペで使える実践テンプレート",
  "gumroad.com",
];
const GUMROAD_URL = "springharu.gumroad.com/l/yariyy";

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { error: "フロントマター（---）がありません", fields: {} };

  const fields = {};
  const lines = match[1].split("\n");
  for (const line of lines) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) {
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      fields[m[1]] = val;
    }
  }
  return { error: null, fields, body: content.slice(match[0].length) };
}

function qaFile(filepath) {
  const rel = filepath.replace(ROOT + "/", "");
  const issues = [];
  const warnings = [];

  if (!existsSync(filepath)) {
    return { rel, ok: false, issues: ["ファイルが存在しません"], warnings: [] };
  }

  const content = readFileSync(filepath, "utf-8");
  const { error, fields, body } = parseFrontmatter(content);

  if (error) {
    issues.push(error);
    return { rel, ok: false, issues, warnings };
  }

  for (const key of REQUIRED_FRONTMATTER) {
    if (!(key in fields)) issues.push(`フロントマター欠落: ${key}`);
  }

  if (fields.published === "true") {
    warnings.push("published: true — 公開済み。変更は慎重に");
  }

  if (fields.title && body && !body.includes(fields.title)) {
    warnings.push("本文に title と同じ見出しがありません");
  }

  const hasProblem = PROBLEM_SECTION_PATTERNS.some((p) => content.includes(p));
  if (!hasProblem) {
    issues.push("問題提起セクションらしき記述がありません（「なぜ多くの人が」等）");
  }

  for (const kw of REQUIRED_BODY_KEYWORDS) {
    if (!content.includes(kw)) {
      issues.push(`必須キーワード欠落: 「${kw}」`);
    }
  }

  const hasPoint = (n) =>
    content.includes(`### ${n}`) ||
    content.includes(`**${n}`) ||
    content.includes(`${n} `);
  const pointCount = ["①", "②", "③"].filter(hasPoint).length;
  if (pointCount < 3) {
    issues.push(`3つのポイント不足: ${pointCount}/3`);
  }

  const hasCta = CTA_PATTERNS.some((p) => content.includes(p));
  if (!hasCta) {
    issues.push("CTAセクション（🎁 または gumroad.com）がありません");
  } else if (!content.includes(GUMROAD_URL)) {
    warnings.push(`推奨Gumroad URLと異なります: ${GUMROAD_URL}`);
  }

  if (content.includes("TODO") || content.includes("（読者の悩み")) {
    warnings.push("プレースホルダー文言が残っています");
  }

  // ファイル名チェック
  const basename = rel.split("/").pop();
  if (!/^\d{8}-\d{4}-[a-z0-9-]+\.md$/.test(basename)) {
    warnings.push(`ファイル名が推奨形式と異なります: YYYYMMDD-HHMM-slug.md`);
  }

  return { rel, ok: issues.length === 0, issues, warnings };
}

function main() {
  const args = process.argv.slice(2);
  let files = [];

  if (args.includes("--all") || args.length === 0) {
    if (!existsSync(ARTICLES_DIR)) {
      console.error("articles/ が見つかりません");
      process.exit(1);
    }
    files = readdirSync(ARTICLES_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => join(ARTICLES_DIR, f));
  } else {
    files = args.filter((a) => !a.startsWith("-")).map((f) => (f.startsWith("/") ? f : join(ROOT, f)));
  }

  let totalIssues = 0;
  let totalWarnings = 0;

  for (const f of files) {
    const result = qaFile(f);
    const icon = result.ok ? "✅" : "❌";
    console.log(`\n${icon} ${result.rel}`);

    for (const i of result.issues) {
      console.log(`  ERROR: ${i}`);
      totalIssues++;
    }
    for (const w of result.warnings) {
      console.log(`  WARN:  ${w}`);
      totalWarnings++;
    }
    if (result.ok && result.warnings.length === 0) {
      console.log("  OK");
    }
  }

  console.log(`\n--- Summary: ${files.length} files, ${totalIssues} errors, ${totalWarnings} warnings ---`);
  process.exit(totalIssues > 0 ? 1 : 0);
}

main();
