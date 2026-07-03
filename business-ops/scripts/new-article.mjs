#!/usr/bin/env node
/**
 * 新規記事の骨組みを articles/ に生成する
 *
 * Usage:
 *   node business-ops/scripts/new-article.mjs --title "タイトル" --slug my-slug
 *   node business-ops/scripts/new-article.mjs --title "タイトル" --slug my-slug --emoji "💰"
 */

import { writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const ARTICLES_DIR = join(ROOT, "articles");

function parseArgs(argv) {
  const args = { title: "", slug: "", emoji: "🌟", type: "idea", dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--title") args.title = argv[++i] ?? "";
    else if (a === "--slug") args.slug = argv[++i] ?? "";
    else if (a === "--emoji") args.emoji = argv[++i] ?? "🌟";
    else if (a === "--type") args.type = argv[++i] ?? "idea";
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--help" || a === "-h") {
      console.log(`Usage: node new-article.mjs --title "..." --slug slug [--emoji 🌟] [--dry-run]`);
      process.exit(0);
    }
  }
  return args;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function timestamp() {
  const d = new Date();
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-` +
    `${pad(d.getHours())}${pad(d.getMinutes())}`
  );
}

function validateSlug(slug) {
  if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(slug)) {
    throw new Error("slug は英小文字・数字・ハイフンのみ（先頭は英数字）");
  }
}

function buildContent({ title, emoji, type }) {
  const topics = '["AI", "副業", "ChatGPT", "生産性向上"]';
  return `---
title: "${title.replace(/"/g, '\\"')}"
emoji: "${emoji}"
type: "${type}"
topics: ${topics}
published: false
---

## ${title}

## なぜ多くの人が${title}で結果を出せないのか

（読者の悩み・共感を書く。200〜400字）

## ${title}で成果を出す人が密かにやっている3つのこと

### ① （ポイント1の見出し）
- なぜ効くのか：
- 具体的にやること：
- 実践例：
- すぐできる一歩：

### ② （ポイント2の見出し）
- なぜ効くのか：
- 具体的にやること：
- 実践例：
- すぐできる一歩：

### ③ （ポイント3の見出し）
- なぜ効くのか：
- 具体的にやること：
- 実践例：
- すぐできる一歩：

ここまでは基本です。ただ、ほとんどの人はここで止まります。

## 🎁 コピペで使える実践テンプレートを手に入れる

この記事の内容をすぐ実践に移したい方へ、すぐ使えるツールを用意しています。

**→ [Note.comで月収5万円を達成するための実践ガイド](https://springharu.gumroad.com/l/yariyy)**
✅ コピペで今日から使える　✅ ¥2400（コーヒー1杯分）

---

*続きは [note.com の有料記事](https://note.com) でお読みいただけます。*
`;
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.title.trim()) {
    console.error("Error: --title は必須です");
    process.exit(1);
  }
  if (!args.slug.trim()) {
    console.error("Error: --slug は必須です");
    process.exit(1);
  }
  validateSlug(args.slug);

  const filename = `${timestamp()}-${args.slug}.md`;
  const filepath = join(ARTICLES_DIR, filename);

  if (existsSync(filepath)) {
    console.error(`Error: 既に存在します: ${filepath}`);
    process.exit(1);
  }

  const content = buildContent(args);

  if (args.dryRun) {
    console.log(`# Would create: articles/${filename}\n`);
    console.log(content);
    return;
  }

  writeFileSync(filepath, content, "utf-8");
  console.log(`Created: articles/${filename}`);
  console.log(`Next: node business-ops/scripts/article-qa.mjs articles/${filename}`);
}

main();
