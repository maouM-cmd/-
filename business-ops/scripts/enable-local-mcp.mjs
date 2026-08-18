#!/usr/bin/env node
/**
 * 自宅PC用: .cursor/mcp.json を example から作り、claude のパスを埋める。
 * mcp.json は gitignore。コミットしない。
 *
 * Usage:
 *   node business-ops/scripts/enable-local-mcp.mjs
 */

import { execSync } from "child_process";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const EXAMPLE = join(ROOT, ".cursor/mcp.json.example");
const TARGET = join(ROOT, ".cursor/mcp.json");
const HOME = homedir();
const LOCAL = process.env.LOCALAPPDATA || join(HOME, "AppData", "Local");
const ROAMING = process.env.APPDATA || join(HOME, "AppData", "Roaming");

function which(cmd) {
  const isWin = process.platform === "win32";
  try {
    const out = execSync(isWin ? `where.exe ${cmd}` : `command -v ${cmd}`, {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    const line = out
      .split(/\r?\n/)
      .map((s) => s.trim())
      .find((s) => s && !s.toLowerCase().includes("info:"));
    return line || "";
  } catch {
    return "";
  }
}

function firstExisting(paths) {
  return paths.find((p) => p && existsSync(p)) || "";
}

function findClaude() {
  return (
    which("claude") ||
    firstExisting([
      join(HOME, ".local", "bin", "claude.exe"),
      join(HOME, ".local", "bin", "claude"),
      join(LOCAL, "Programs", "Claude", "claude.exe"),
      join(ROAMING, "npm", "claude.cmd"),
      join(ROAMING, "npm", "claude"),
    ])
  );
}

function findAgent() {
  return (
    which("agent") ||
    which("cursor-agent") ||
    firstExisting([
      join(LOCAL, "cursor-agent", "agent.cmd"),
      join(LOCAL, "cursor-agent", "agent.exe"),
      join(HOME, ".local", "bin", "agent.exe"),
      join(HOME, ".local", "bin", "agent"),
    ])
  );
}

function main() {
  if (!existsSync(EXAMPLE)) {
    console.error("missing .cursor/mcp.json.example");
    process.exit(1);
  }

  copyFileSync(EXAMPLE, TARGET);
  const cfg = JSON.parse(readFileSync(TARGET, "utf-8"));
  const claude = findClaude();
  const agent = findAgent();

  if (claude) {
    cfg.mcpServers["claude-code"].command = claude;
    console.log(`wrote ${TARGET}`);
    console.log(`claude: ${claude}`);
  } else {
    console.log(`wrote ${TARGET} (command は "claude" のまま)`);
    console.log("claude: 見つからない。PowerShell で入れてから、このスクリプトを再実行:");
    console.log('  irm https://claude.ai/install.ps1 | iex');
    console.log("  入れたら PowerShell を開き直し、claude でログイン。");
    console.log("  公式: https://code.claude.com/docs/en/installation");
  }

  if (agent) {
    console.log(`agent: ${agent}`);
  } else {
    console.log("agent: 見つからない。PowerShell で入れてから再実行:");
    console.log("  irm 'https://cursor.com/install?win32=true' | iex");
    console.log("  入れたら PowerShell を開き直し、agent login");
    console.log("  Git Bash では入れない。公式: https://cursor.com/docs/cli/installation");
  }

  writeFileSync(TARGET, JSON.stringify(cfg, null, 2) + "\n", "utf-8");
  console.log("");
  console.log("次（人間・Cursor の画面だけ）:");
  console.log("  1. Cursor を開き直す");
  console.log("  2. Settings → MCP → claude-code を Enable / 承認");
  console.log("  3. git add .cursor/mcp.json はしない");
}

main();
