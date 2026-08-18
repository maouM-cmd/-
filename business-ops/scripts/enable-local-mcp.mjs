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
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const EXAMPLE = join(ROOT, ".cursor/mcp.json.example");
const TARGET = join(ROOT, ".cursor/mcp.json");

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

function main() {
  if (!existsSync(EXAMPLE)) {
    console.error("missing .cursor/mcp.json.example");
    process.exit(1);
  }

  copyFileSync(EXAMPLE, TARGET);
  const cfg = JSON.parse(readFileSync(TARGET, "utf-8"));
  const claude = which("claude");
  const agent = which("agent");

  if (claude) {
    cfg.mcpServers["claude-code"].command = claude;
    writeFileSync(TARGET, JSON.stringify(cfg, null, 2) + "\n", "utf-8");
    console.log(`wrote ${TARGET}`);
    console.log(`claude: ${claude}`);
  } else {
    writeFileSync(TARGET, JSON.stringify(cfg, null, 2) + "\n", "utf-8");
    console.log(`wrote ${TARGET} (command は "claude" のまま)`);
    console.log("claude: 見つからない。自宅で Claude Code を入れ、もう一度このスクリプトを実行。");
  }

  console.log(agent ? `agent: ${agent}` : "agent: 見つからない。Cursor を最新にして CLI を入れる。");
  console.log("");
  console.log("次（人間・Cursor の画面だけ）:");
  console.log("  1. Cursor を開き直す");
  console.log("  2. Settings → MCP → claude-code を Enable / 承認");
  console.log("  3. git add .cursor/mcp.json はしない");
}

main();
