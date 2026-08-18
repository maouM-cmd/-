#!/usr/bin/env node
/**
 * Cursor と Claude Code の非同期DM（スレッドファイル）
 *
 * Usage:
 *   node business-ops/scripts/agent-dm.mjs inbox --from cursor
 *   node business-ops/scripts/agent-dm.mjs send --from cursor --to claude-code --title "..." --body "..."
 *   node business-ops/scripts/agent-dm.mjs reply --id <id> --from claude-code --body "..."
 *   node business-ops/scripts/agent-dm.mjs show --id <id>
 *   node business-ops/scripts/agent-dm.mjs close --id <id> --from human --body "done"
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const THREAD_DIR = join(ROOT, "business-ops/agent-dm/threads");
const ACTORS = ["cursor", "claude-code", "human"];
const MAX_TURNS = 8;

function pad(n) {
  return String(n).padStart(2, "0");
}

function nowIso() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

function stamp() {
  const d = new Date();
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-` +
    `${pad(d.getHours())}${pad(d.getMinutes())}`
  );
}

function slugify(title) {
  const ascii = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
  return ascii || "thread";
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) args[key] = true;
      else {
        args[key] = next;
        i++;
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

function usage() {
  console.log(`Usage:
  node business-ops/scripts/agent-dm.mjs inbox --from <cursor|claude-code|human>
  node business-ops/scripts/agent-dm.mjs send --from <actor> --to <actor> --title "..." --body "..."
  node business-ops/scripts/agent-dm.mjs reply --id <id> --from <actor> --body "..."
  node business-ops/scripts/agent-dm.mjs show --id <id>
  node business-ops/scripts/agent-dm.mjs close --id <id> --from <actor> [--body "..."]`);
}

function assertActor(value, label) {
  if (!ACTORS.includes(value)) {
    throw new Error(`${label} は ${ACTORS.join(" / ")} のいずれか`);
  }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error("フロントマターがありません");
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    fields[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { fields, body: match[2] };
}

function dumpFrontmatter(fields) {
  const order = ["id", "from", "to", "waiting", "status", "turns", "max_turns", "created", "updated"];
  const lines = order.filter((k) => fields[k] != null).map((k) => `${k}: ${fields[k]}`);
  return `---\n${lines.join("\n")}\n---\n`;
}

function threadPath(id) {
  return join(THREAD_DIR, `${id}.md`);
}

function listThreadFiles() {
  if (!existsSync(THREAD_DIR)) return [];
  return readdirSync(THREAD_DIR)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => {
      const content = readFileSync(join(THREAD_DIR, f), "utf-8");
      const { fields, body } = parseFrontmatter(content);
      return { file: f, fields, body, content };
    });
}

function loadThread(id) {
  const path = threadPath(id);
  if (!existsSync(path)) throw new Error(`スレッドがありません: ${id}`);
  const content = readFileSync(path, "utf-8");
  const parsed = parseFrontmatter(content);
  return { path, content, ...parsed };
}

function lastSpeaker(body) {
  const matches = [...body.matchAll(/^### \S+ (\S+)/gm)];
  if (matches.length === 0) return null;
  return matches[matches.length - 1][1];
}

function cmdInbox(args) {
  const from = args.from;
  assertActor(from, "--from");
  const open = listThreadFiles().filter(
    (t) => t.fields.status === "open" && t.fields.waiting === from,
  );
  if (open.length === 0) {
    console.log(`inbox empty for ${from}`);
    return;
  }
  for (const t of open) {
    const turns = t.fields.turns || "?";
    console.log(`${t.fields.id}\twaiting=${t.fields.waiting}\tturns=${turns}\t${t.fields.to === from ? "←" : "→"} ${t.fields.from}\t${t.body.split("\n").find((l) => l.startsWith("# "))?.slice(2) || ""}`);
  }
}

function cmdShow(args) {
  const id = args.id;
  if (!id) throw new Error("--id が必要");
  const { content } = loadThread(id);
  process.stdout.write(content);
  if (!content.endsWith("\n")) process.stdout.write("\n");
}

function cmdSend(args) {
  const from = args.from;
  const to = args.to;
  const title = args.title;
  const body = args.body;
  assertActor(from, "--from");
  assertActor(to, "--to");
  if (from === to) throw new Error("自分自身には送れない");
  if (!title || !body) throw new Error("--title と --body が必要");

  mkdirSync(THREAD_DIR, { recursive: true });
  const id = `${stamp()}-${slugify(title)}`;
  const created = nowIso();
  const fields = {
    id,
    from,
    to,
    waiting: to,
    status: "open",
    turns: "1",
    max_turns: String(MAX_TURNS),
    created,
    updated: created,
  };
  const content =
    dumpFrontmatter(fields) +
    `\n# ${title}\n\n## 依頼\n\n${from} → ${to}:\n\n${body.trim()}\n\n## 履歴\n\n### ${created} ${from}\n\n${body.trim()}\n`;
  writeFileSync(threadPath(id), content, "utf-8");
  console.log(id);
}

function appendTurn({ id, from, body, close }) {
  assertActor(from, "--from");
  if (!id) throw new Error("--id が必要");
  if (!close && !body) throw new Error("--body が必要");

  const thread = loadThread(id);
  const fields = { ...thread.fields };
  if (fields.status !== "open") throw new Error(`閉じ済み: ${id}`);

  const speaker = lastSpeaker(thread.body);
  if (!close && speaker === from) {
    throw new Error("最後に書いた側は返信できない（ループ防止）");
  }
  if (fields.waiting !== from && from !== "human") {
    throw new Error(`今動けるのは waiting=${fields.waiting}。${from} は待つ`);
  }

  const turns = Number(fields.turns || "0") + 1;
  if (from !== "human" && turns > Number(fields.max_turns || MAX_TURNS)) {
    throw new Error(`ターン上限 ${fields.max_turns}。human が close するか判断する`);
  }

  const ts = nowIso();
  const note = (body || (close ? "closed" : "")).trim();
  let waiting = "human";
  if (!close) {
    if (from === "human") {
      waiting = speaker === "cursor" ? "claude-code" : "cursor";
    } else {
      waiting = from === "cursor" ? "claude-code" : "cursor";
    }
    if (from !== "human" && turns >= Number(fields.max_turns || MAX_TURNS)) {
      waiting = "human";
    }
  }

  fields.turns = String(turns);
  fields.updated = ts;
  fields.waiting = waiting;
  if (close) fields.status = "closed";

  const content =
    dumpFrontmatter(fields) +
    thread.body.trimEnd() +
    `\n\n### ${ts} ${from}\n\n${note}\n`;
  writeFileSync(thread.path, content, "utf-8");
  console.log(`${id}\twaiting=${fields.waiting}\tstatus=${fields.status}\tturns=${fields.turns}`);
}

function cmdReply(args) {
  appendTurn({ id: args.id, from: args.from, body: args.body, close: false });
}

function cmdClose(args) {
  appendTurn({ id: args.id, from: args.from || "human", body: args.body || "closed", close: true });
}

function main() {
  const args = parseArgs(process.argv);
  const cmd = args._[0];
  if (!cmd || cmd === "help" || args.help) {
    usage();
    process.exit(cmd ? 0 : 1);
  }
  try {
    if (cmd === "inbox") cmdInbox(args);
    else if (cmd === "send") cmdSend(args);
    else if (cmd === "reply") cmdReply(args);
    else if (cmd === "show") cmdShow(args);
    else if (cmd === "close") cmdClose(args);
    else {
      usage();
      throw new Error(`不明なコマンド: ${cmd}`);
    }
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
}

main();
