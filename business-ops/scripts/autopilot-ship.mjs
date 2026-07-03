#!/usr/bin/env node
/**
 * 全自動 GitHub 投稿: preflight → commit → push → draft PR
 *
 * Usage:
 *   node business-ops/scripts/autopilot-ship.mjs
 *   node business-ops/scripts/autopilot-ship.mjs --dry-run
 *   node business-ops/scripts/autopilot-ship.mjs --yes   # 確認プロンプトをスキップ
 */

import { execSync, spawnSync } from "child_process";
import { readFileSync, existsSync, writeFileSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const CONFIG_PATH = join(__dirname, "../config/autopilot.json");

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    return { level: 2, auto_commit: true, auto_push: true, auto_pr: true, auto_merge: false, draft_pr: true, protected_branches: ["main", "master"], require_preflight: true, base_branch: "main" };
  }
  return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
}

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf-8", stdio: opts.silent ? "pipe" : "inherit", ...opts });
}

function runCapture(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

function askYesNo(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`${question} [y/N] `, (ans) => {
      rl.close();
      resolve(/^y(es)?$/i.test(ans.trim()));
    });
  });
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const forceYes = process.argv.includes("--yes");
  const config = loadConfig();

  const branch = runCapture("git branch --show-current");
  const status = runCapture("git status --porcelain");

  console.log("=== Autopilot Ship ===\n");
  console.log(`Level: L${config.level} | Branch: ${branch}`);

  if (config.protected_branches?.includes(branch)) {
    console.error(`\nERROR: protected branch "${branch}" への自動投稿は禁止されています。`);
    console.error(`feature branch を作成してください:`);
    console.error(`  node business-ops/scripts/autopilot.mjs branch --name my-feature`);
    process.exit(1);
  }

  if (!status) {
    console.log("\n変更なし — 投稿スキップ");
    process.exit(0);
  }

  // Preflight
  if (config.require_preflight !== false) {
    console.log("\n[1/4] Preflight...");
    if (dryRun) {
      console.log("  (dry-run: would run github-preflight.sh)");
    } else {
      const pf = spawnSync("bash", [join(__dirname, "github-preflight.sh")], { cwd: ROOT, stdio: "inherit" });
      if (pf.status !== 0) process.exit(pf.status ?? 1);
    }
  }

  // Ship metadata
  console.log("\n[2/4] Generating commit/PR metadata...");
  const shipJson = dryRun
    ? JSON.stringify({ commitMessage: "feat: autopilot dry-run", prTitle: "Autopilot dry-run", prBody: "Dry run", files: [] })
    : runCapture("node business-ops/scripts/github-ship.mjs --json");
  const ship = JSON.parse(shipJson || "{}");
  const commitMsg = ship.commitMessage?.split("\n")[0] || "chore: autopilot ship";

  console.log(`  Commit: ${commitMsg}`);
  console.log(`  PR:     ${ship.prTitle}`);
  console.log(`  Files:  ${ship.files?.length ?? "?"}`);

  if (!forceYes && !dryRun && process.stdin.isTTY) {
    const ok = await askYesNo("\n自動で commit → push → draft PR しますか？");
    if (!ok) {
      console.log("中止しました。文案のみ: node business-ops/scripts/github-ship.mjs");
      process.exit(0);
    }
  }

  if (dryRun) {
    console.log("\n[DRY-RUN] Would execute:");
    console.log("  git add -A");
    console.log(`  git commit -m "${commitMsg}"`);
    console.log(`  git push -u origin ${branch}`);
    console.log(`  gh pr create --draft --title "${ship.prTitle}"`);
    process.exit(0);
  }

  // Commit
  if (config.auto_commit !== false) {
    console.log("\n[3/4] Commit & Push...");
    run("git add -A", { silent: true });
    try {
      run(`git commit -m ${JSON.stringify(commitMsg)}`, { silent: true });
    } catch {
      console.log("  (commit skipped — nothing to commit or already committed)");
    }

    if (config.auto_push !== false) {
      const pushCmd = runCapture("git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null")
        ? `git push`
        : `git push -u origin ${branch}`;
      run(pushCmd);
    }
  }

  // PR
  if (config.auto_pr !== false) {
    console.log("\n[4/4] Create PR...");
    const existingPr = runCapture(`gh pr view --json url -q .url 2>/dev/null`);
    if (existingPr) {
      console.log(`  PR already exists: ${existingPr}`);
    } else {
      const draftFlag = config.draft_pr !== false ? "--draft" : "";
      const bodyFile = join(ROOT, ".autopilot-pr-body.md");
      writeFileSync(bodyFile, ship.prBody || "", "utf-8");
      try {
        const prUrl = runCapture(
          `gh pr create ${draftFlag} --base ${config.base_branch || "main"} --title ${JSON.stringify(ship.prTitle || commitMsg)} --body-file ${JSON.stringify(bodyFile)}`
        );
        console.log(`  Created: ${prUrl}`);
      } finally {
        try { unlinkSync(bodyFile); } catch { /* ignore */ }
      }
    }
  }

  console.log("\n=== Autopilot Ship Complete ===");
  if (config.auto_merge) {
    console.log("NOTE: auto_merge=true — CI通過後にマージされます（L3）");
  } else {
    console.log("次: CI確認 → 問題なければ PR をマージ（または L3 を有効化）");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
