#!/usr/bin/env node
/**
 * personal-vault の機械QA — frontmatter・MOCリンク・空ノートを検証
 *
 * Usage:
 *   node business-ops/scripts/knowledge-vault-qa.mjs
 *   node business-ops/scripts/knowledge-vault-qa.mjs personal-vault/成り立ち.md
 */

import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const VAULT_DIR = join(ROOT, "personal-vault");

const REQUIRED_FRONTMATTER = ["title", "tags", "created", "updated", "status", "shareable"];
const CORE_NOTES = ["成り立ち", "価値観", "考え方", "仕事の進め方", "目標とビジョン"];
const PLACEHOLDER = "（対話で追記予定）";

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { error: "フロントマター（---）がありません", fields: {}, body: "" };

  const fields = {};
  const lines = match[1].split("\n");
  let currentKey = null;

  for (const line of lines) {
    const keyMatch = line.match(/^(\w+):\s*(.*)$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      let val = keyMatch[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      fields[currentKey] = val;
    } else if (currentKey === "tags" && line.trim().startsWith("- ")) {
      if (!Array.isArray(fields.tags)) fields.tags = [];
      fields.tags.push(line.trim().slice(2));
    }
  }

  return { error: null, fields, body: content.slice(match[0].length) };
}

function collectMarkdownFiles(dir, base = dir) {
  const results = [];
  if (!existsSync(dir)) return results;

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = full.replace(base + "/", "");
    if (statSync(full).isDirectory()) {
      if (entry === "templates") continue;
      results.push(...collectMarkdownFiles(full, base));
    } else if (entry.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

function qaFile(filepath) {
  const rel = filepath.replace(ROOT + "/", "");
  const issues = [];
  const warnings = [];

  if (!existsSync(filepath)) {
    return { rel, ok: false, issues: ["ファイルが存在しません"], warnings: [] };
  }

  if (rel === "personal-vault/README.md") {
    return { rel, ok: true, issues, warnings };
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

  if (fields.status && !["draft", "stable"].includes(fields.status)) {
    warnings.push(`status が draft/stable 以外: ${fields.status}`);
  }

  if (fields.shareable && !["true", "false"].includes(fields.shareable)) {
    warnings.push(`shareable が true/false 以外: ${fields.shareable}`);
  }

  const bodyWithoutFrontmatter = body.trim();
  const sections = ["## 事実", "## 解釈", "## 具体例"];
  const isCoreNote = CORE_NOTES.some((n) => rel === `personal-vault/${n}.md`);
  const isMoc = rel === "personal-vault/00-MOC-プロフィール.md";
  const isSession = rel.startsWith("personal-vault/sessions/");

  if (isCoreNote) {
    for (const section of sections) {
      if (!content.includes(section)) {
        issues.push(`必須セクション欠落: ${section}`);
      }
    }

    const placeholderCount = (body.match(new RegExp(PLACEHOLDER, "g")) || []).length;
    if (placeholderCount >= 3) {
      warnings.push(`プレースホルダーが多い（${placeholderCount}箇所）— 対話未実施の可能性`);
    }
  }

  if (isSession && !content.includes("## 質問")) {
    issues.push("セッションログに「## 質問」セクションがありません");
  }

  if (!isMoc && !rel.includes("/templates/") && bodyWithoutFrontmatter.length < 50) {
    warnings.push("本文が極端に短いです");
  }

  return { rel, ok: issues.length === 0, issues, warnings };
}

function qaMocLinks() {
  const issues = [];
  const warnings = [];
  const mocPath = join(VAULT_DIR, "00-MOC-プロフィール.md");

  if (!existsSync(mocPath)) {
    return { issues: ["00-MOC-プロフィール.md が存在しません"], warnings: [] };
  }

  const mocContent = readFileSync(mocPath, "utf-8");

  for (const note of CORE_NOTES) {
    const wikilink = `[[${note}]]`;
    if (!mocContent.includes(wikilink)) {
      issues.push(`MOC に wikilink がありません: ${wikilink}`);
    }
    const notePath = join(VAULT_DIR, `${note}.md`);
    if (!existsSync(notePath)) {
      issues.push(`MOC が参照するノートが存在しません: ${note}.md`);
    }
  }

  return { issues, warnings };
}

function main() {
  const args = process.argv.slice(2);
  let files = [];

  if (!existsSync(VAULT_DIR)) {
    console.error("personal-vault/ が見つかりません");
    process.exit(1);
  }

  if (args.length === 0) {
    files = collectMarkdownFiles(VAULT_DIR);
  } else {
    files = args.map((f) => (f.startsWith("/") ? f : join(ROOT, f)));
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

  const mocResult = qaMocLinks();
  if (mocResult.issues.length > 0 || mocResult.warnings.length > 0) {
    console.log("\n📋 MOC リンクチェック");
    for (const i of mocResult.issues) {
      console.log(`  ERROR: ${i}`);
      totalIssues++;
    }
    for (const w of mocResult.warnings) {
      console.log(`  WARN:  ${w}`);
      totalWarnings++;
    }
  } else {
    console.log("\n📋 MOC リンクチェック: OK");
  }

  console.log(`\n--- Summary: ${files.length} files, ${totalIssues} errors, ${totalWarnings} warnings ---`);
  process.exit(totalIssues > 0 ? 1 : 0);
}

main();
