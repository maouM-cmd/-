#!/usr/bin/env node
/**
 * 全自動オーケストレーター
 *
 * Usage:
 *   node business-ops/scripts/autopilot.mjs new --name my-app --type nextjs
 *   node business-ops/scripts/autopilot.mjs branch --name my-feature
 *   node business-ops/scripts/autopilot.mjs check
 *   node business-ops/scripts/autopilot.mjs ship [--yes]
 *   node business-ops/scripts/autopilot.mjs full --name my-app --type nextjs [--yes]
 */

import { execSync, spawnSync } from "child_process";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const CONFIG_PATH = join(__dirname, "../config/autopilot.json");

function loadConfig() {
  return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
}

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf-8", stdio: opts.inherit ? "inherit" : "pipe", ...opts });
}

function runInherit(cmd) {
  execSync(cmd, { cwd: ROOT, stdio: "inherit" });
}

function runCapture(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
}

function branchName(feature, config) {
  const prefix = config.branch_prefix || "cursor/";
  const suffix = config.branch_suffix || "-29d8";
  return `${prefix}${slugify(feature)}${suffix}`;
}

function cmdNew(args, config) {
  const nameIdx = args.indexOf("--name");
  const typeIdx = args.indexOf("--type");
  const name = nameIdx >= 0 ? args[nameIdx + 1] : "";
  const type = typeIdx >= 0 ? args[typeIdx + 1] : "nextjs";
  if (!name) {
    console.error("Usage: autopilot new --name my-app [--type nextjs|minimal]");
    process.exit(1);
  }

  const branch = branchName(name, config);
  console.log(`\n=== Autopilot NEW: ${name} ===\n`);

  // 1. Branch
  const current = runCapture("git branch --show-current");
  if (current !== branch) {
    const exists = runCapture(`git branch --list ${branch}`);
    if (exists) {
      runInherit(`git checkout ${branch}`);
    } else {
      runInherit(`git checkout -b ${branch}`);
    }
  }
  console.log(`[OK] Branch: ${branch}`);

  // 2. Scaffold
  runInherit(`node business-ops/scripts/new-web-project.mjs --name ${name} --type ${type}`);
  console.log(`[OK] Scaffold: ${name}/`);

  // 3. Brief
  const briefDir = join(ROOT, "business-ops/briefs");
  mkdirSync(briefDir, { recursive: true });
  const briefPath = join(briefDir, `${name}-brief.md`);
  if (!existsSync(briefPath)) {
    const template = readFileSync(join(__dirname, "../templates/project-brief.md"), "utf-8");
    writeFileSync(briefPath, template.replace("プロジェクト名（slug） | |", `プロジェクト名（slug） | ${name} |`), "utf-8");
    console.log(`[OK] Brief: business-ops/briefs/${name}-brief.md`);
  }

  // 4. Agent prompt file
  const promptPath = join(briefDir, `${name}-AGENT_PROMPT.md`);
  const prompt = `# Autopilot Agent Prompt — ${name}

\`\`\`
@autopilot @web-dev-github

## タスク
business-ops/briefs/${name}-brief.md を読み、${name}/ の MVP を実装してください。

## ルール
- REQUIREMENTS.md / IMPLEMENTATION.md を更新
- lint/build が通ること
- 完了後、以下を**自動実行**:
  node business-ops/scripts/autopilot.mjs ship --yes

## 禁止
- main への push
- 課金・デプロイ・外部投稿
\`\`\`
`;
  writeFileSync(promptPath, prompt, "utf-8");
  console.log(`[OK] Agent prompt: business-ops/briefs/${name}-AGENT_PROMPT.md`);

  console.log(`
=== 次のステップ ===
1. business-ops/briefs/${name}-brief.md を埋める
2. Cursor に ${name}-AGENT_PROMPT.md の内容を貼る
3. または: node business-ops/scripts/autopilot.mjs ship --yes
`);
}

function cmdBranch(args, config) {
  const nameIdx = args.indexOf("--name");
  const name = nameIdx >= 0 ? args[nameIdx + 1] : "";
  if (!name) {
    console.error("Usage: autopilot branch --name my-feature");
    process.exit(1);
  }
  const branch = branchName(name, config);
  const exists = runCapture(`git branch --list ${branch}`);
  if (exists) {
    runInherit(`git checkout ${branch}`);
  } else {
    runInherit(`git checkout -b ${branch}`);
  }
  console.log(`On branch: ${branch}`);
}

function cmdCheck() {
  console.log("\n=== Autopilot CHECK ===\n");
  const config = loadConfig();
  console.log(`Config level: L${config.level}`);

  const checks = [
    ["git", "git --version"],
    ["gh", "gh --version"],
    ["gh auth", "gh auth status"],
    ["node", "node --version"],
  ];

  for (const [name, cmd] of checks) {
    try {
      const out = runCapture(cmd).split("\n")[0];
      console.log(`  OK  ${name}: ${out}`);
    } catch {
      console.log(`  FAIL ${name}`);
    }
  }

  if (config.run_project_checks && existsSync(join(ROOT, "coupon-board/package.json"))) {
    console.log("\n  Project checks (coupon-board)...");
    const lint = spawnSync("bash", ["-c", "cd coupon-board && npm run lint"], { cwd: ROOT, stdio: "pipe" });
    console.log(lint.status === 0 ? "  OK  coupon-board lint" : "  WARN coupon-board lint failed");
  }

  console.log("\n=== Ready for autopilot ===\n");
}

function cmdShip(args) {
  const extra = args.includes("--yes") ? "--yes" : "";
  const dry = args.includes("--dry-run") ? "--dry-run" : "";
  runInherit(`node business-ops/scripts/autopilot-ship.mjs ${extra} ${dry}`.trim());
}

function cmdFull(args, config) {
  const nameIdx = args.indexOf("--name");
  const name = nameIdx >= 0 ? args[nameIdx + 1] : "";
  if (!name) {
    console.error("Usage: autopilot full --name my-app [--type nextjs] [--yes]");
    process.exit(1);
  }
  cmdNew(args, config);
  console.log("\n--- FULL mode: scaffold 完了 ---");
  console.log("実装は Cursor エージェントに委任 → 完了後 ship --yes が自動実行されます。");
  console.log(`\nCursor に貼る: business-ops/briefs/${name}-AGENT_PROMPT.md`);
}

function printHelp() {
  console.log(`
Autopilot — 全自動 Web開発 + GitHub 投稿

Commands:
  new     --name <slug> [--type nextjs|minimal]   新規プロジェクト自動立ち上げ
  branch  --name <feature>                        feature branch 作成・切替
  check                                           環境・認証チェック
  ship    [--yes] [--dry-run]                     commit→push→draft PR 全自動
  full    --name <slug> [--type nextjs]           new + エージェント指示書生成

Config: business-ops/config/autopilot.json
  L2 (default): auto commit + push + draft PR
  L3: + auto_merge (CI通過後マージ) — auto_merge:true で有効

Examples:
  node business-ops/scripts/autopilot.mjs check
  node business-ops/scripts/autopilot.mjs new --name todo-app --type nextjs
  node business-ops/scripts/autopilot.mjs ship --yes
`);
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  const config = existsSync(CONFIG_PATH)
    ? loadConfig()
    : { branch_prefix: "cursor/", branch_suffix: "-29d8" };

  switch (command) {
    case "new": cmdNew(args, config); break;
    case "branch": cmdBranch(args, config); break;
    case "check": cmdCheck(); break;
    case "ship": cmdShip(args); break;
    case "full": cmdFull(args, config); break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

main();
