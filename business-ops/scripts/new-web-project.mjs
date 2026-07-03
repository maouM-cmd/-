#!/usr/bin/env node
/**
 * 新規Webプロジェクトの骨組みを生成
 *
 * Usage:
 *   node business-ops/scripts/new-web-project.mjs --name my-app --type nextjs
 *   node business-ops/scripts/new-web-project.mjs --name my-tool --type minimal
 */

import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

function parseArgs(argv) {
  const args = { name: "", type: "minimal", dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--name") args.name = argv[++i] ?? "";
    else if (a === "--type") args.type = argv[++i] ?? "minimal";
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--help" || a === "-h") {
      console.log("Usage: new-web-project.mjs --name my-app [--type nextjs|minimal] [--dry-run]");
      process.exit(0);
    }
  }
  return args;
}

function validateName(name) {
  if (!/^[a-z][a-z0-9-]{1,39}$/.test(name)) {
    throw new Error("name は英小文字・数字・ハイフン（先頭英字）");
  }
}

const files = {
  "README.md": (name, type) => `# ${name}

## 概要

（1〜2文で説明）

## セットアップ

\`\`\`bash
cd ${name}
${type === "nextjs" ? "npm install\nnpm run dev" : "# セットアップ手順を記載"}
\`\`\`

## ドキュメント

- [REQUIREMENTS.md](./REQUIREMENTS.md) — 要件定義
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) — 実装対応表

## ライセンス

Private
`,

  "REQUIREMENTS.md": (name) => `# ${name} 要件定義 v0.1

## 概要

（何を作るか）

## 確定事項

| 項目 | 内容 |
|------|------|
| 目的 | |
| ユーザー | |
| 技術スタック | |

## MVP機能

- [ ] 機能1
- [ ] 機能2
- [ ] 機能3

## 非機能要件

- [ ] レスポンシブ対応
- [ ] エラーハンドリング

## スコープ外（今回やらない）

-

## 未決事項

-
`,

  "BASIC_DESIGN.md": (name) => `# ${name} 基本設計 v0.1

> 要件: [REQUIREMENTS.md](./REQUIREMENTS.md)

## アーキテクチャ

（図または箇条書き）

## 画面一覧

| パス | 説明 |
|------|------|
| / | |

## データモデル

（主要エンティティ）
`,

  "IMPLEMENTATION.md": (name) => `# ${name} 実装対応表

**ステータス: 未着手**

## 機能 → ファイル

| 機能 ID | 機能 | ページ | API | Lib |
|---------|------|--------|-----|-----|
| F01 | | | | |

## 起動

\`\`\`bash
cd ${name}
# セットアップ後に追記
\`\`\`
`,

  "AGENTS.md": (name, type) => type === "nextjs"
    ? `<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in \`node_modules/next/dist/docs/\` before writing any code.
<!-- END:nextjs-agent-rules -->
`
    : `# AI Agent Rules — ${name}

- スコープ最小で変更すること
- REQUIREMENTS.md を正とすること
- 破壊的変更・デプロイは人間承認後のみ
`,

  ".gitignore": () => `node_modules/
.next/
dist/
build/
.env
.env.local
*.log
.DS_Store
output/
`,

  "package.json": (name) => JSON.stringify({
    name,
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "eslint .",
    },
  }, null, 2) + "\n",
};

function main() {
  const args = parseArgs(process.argv);
  if (!args.name) {
    console.error("Error: --name は必須です");
    process.exit(1);
  }
  validateName(args.name);

  const projectDir = join(ROOT, args.name);
  if (existsSync(projectDir)) {
    console.error(`Error: 既に存在します: ${args.name}/`);
    process.exit(1);
  }

  const toCreate = ["README.md", "REQUIREMENTS.md", "BASIC_DESIGN.md", "IMPLEMENTATION.md", "AGENTS.md", ".gitignore"];
  if (args.type === "nextjs") toCreate.push("package.json");

  if (args.dryRun) {
    console.log(`# Would create: ${args.name}/`);
    for (const f of toCreate) console.log(`  ${f}`);
    return;
  }

  mkdirSync(projectDir, { recursive: true });
  for (const f of toCreate) {
    const content = files[f](args.name, args.type);
    writeFileSync(join(projectDir, f), content, "utf-8");
    console.log(`  created: ${args.name}/${f}`);
  }

  console.log(`\nDone: ${args.name}/`);
  console.log("Next:");
  console.log(`  1. business-ops/templates/project-brief.md を記入`);
  console.log(`  2. Cursor で @web-dev-github + ブリーフ`);
  if (args.type === "nextjs") {
    console.log(`  3. cd ${args.name} && npx create-next-app@latest . で本体を上書きセットアップ（または手動実装）`);
  }
}

main();
