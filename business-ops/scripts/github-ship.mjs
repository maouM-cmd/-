#!/usr/bin/env node
/**
 * Git変更からコミットメッセージ・PR文案を生成
 *
 * Usage:
 *   node business-ops/scripts/github-ship.mjs
 *   node business-ops/scripts/github-ship.mjs --json
 */

import { execSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

function run(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

function detectType(files) {
  if (files.some((f) => f.includes("test") || f.includes("spec"))) return "test";
  if (files.every((f) => f.endsWith(".md") || f.includes("docs/"))) return "docs";
  if (files.some((f) => f.includes("fix") || f.includes("bug"))) return "fix";
  if (files.some((f) => f.startsWith("business-ops/") || f.startsWith(".cursor/"))) return "chore";
  return "feat";
}

function summarizeFiles(files) {
  const dirs = new Set(files.map((f) => f.split("/")[0]));
  return [...dirs].slice(0, 4).join(", ");
}

function main() {
  const jsonOut = process.argv.includes("--json");

  const branch = run("git branch --show-current");
  const status = run("git status --porcelain");
  const diffStat = run("git diff --stat HEAD 2>/dev/null") || run("git diff --stat --cached 2>/dev/null");
  const changedFiles = status
    .split("\n")
    .filter(Boolean)
    .map((line) => line.replace(/^\S+\s+/, "").trim())
    .filter((f) => f && !f.includes("->"));

  const staged = run("git diff --cached --name-only");
  const unstaged = run("git diff --name-only");
  const allFiles = [...new Set([...staged.split("\n"), ...unstaged.split("\n"), ...changedFiles].filter(Boolean))];

  const type = detectType(allFiles);
  const scope = summarizeFiles(allFiles) || "project";
  const subject = `${type}: update ${scope}`;

  const commitMessage = `${subject}

${allFiles.length} file(s) changed.
${diffStat ? "\n" + diffStat.split("\n").slice(-3).join("\n") : ""}`.trim();

  const prTitle = subject.replace(/^\w+: /, "").replace(/^./, (c) => c.toUpperCase());
  const prBody = `## Summary
- ${type} changes in: ${scope}
- Branch: \`${branch}\`

## Changes
${allFiles.map((f) => `- \`${f}\``).join("\n") || "- (no files detected)"}

## Test plan
- [ ] Local lint/build passes
- [ ] Manual smoke test
- [ ] CI green

## Safety
- [ ] No secrets committed
- [ ] No destructive operations without approval
`;

  if (jsonOut) {
    console.log(JSON.stringify({ branch, commitMessage, prTitle, prBody, files: allFiles }, null, 2));
    return;
  }

  console.log("=== GitHub Ship Helper ===\n");
  console.log(`Branch: ${branch}`);
  console.log(`Files:  ${allFiles.length}\n`);

  if (!status && !staged && !unstaged) {
    console.log("(変更なし — 作業後に再実行してください)\n");
  }

  console.log("--- Commit message (copy) ---");
  console.log(commitMessage);
  console.log("\n--- PR title ---");
  console.log(prTitle);
  console.log("\n--- PR body (copy) ---");
  console.log(prBody);
  console.log("\n--- Next steps ---");
  console.log("1. bash business-ops/scripts/github-preflight.sh");
  console.log("2. git add -A && git commit -m \"...\"");
  console.log("3. git push -u origin " + branch);
  console.log("4. Create draft PR on GitHub");
}

main();
