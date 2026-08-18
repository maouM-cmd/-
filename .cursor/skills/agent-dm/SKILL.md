---
name: agent-dm
description: Cursor と Claude Code の会話。同じPCなら claude mcp serve。Cloudならスレッド/Issue。カタログとinbox。
---

# Agent DM Skill（Cursor）

## チャネル（先に選ぶ）

1. **同じ Windows** — `business-ops/agent-dm/CATALOG.md` の公式 `claude mcp serve`。`.cursor/mcp.json.example` を自分の `mcp.json` にコピー。ユーザーに「claude-code MCP で実装して」と頼む。自前 CLI は使わない。
2. **Cloud Agent** — GitHub Issue（`gh`）またはスレッドファイル（下記）。
3. コミュニティ MCP の yolo / skip-permissions は使わない。

詳細: `business-ops/agent-dm/CATALOG.md` と `PROTOCOL.md`

## フォールバック（Cloud / 非同期）

公式の相互DMはない。会話口は `business-ops/agent-dm/threads/`。

## 自分

`--from cursor`

## 手順

```bash
git pull --ff-only
node business-ops/scripts/agent-dm.mjs inbox --from cursor
```

自分宛があれば `show` → 作業 → `reply`。無ければ新しい依頼は `send`。

```bash
node business-ops/scripts/agent-dm.mjs send \
  --from cursor --to claude-code \
  --title "短く何を頼むか" \
  --body "やってほしいこと。完了条件。触ってよいパス。禁止事項。"

node business-ops/scripts/agent-dm.mjs reply \
  --id <id> --from cursor \
  --body "レビュー結果。OKなら close を human に依頼。NGなら修正点だけ。"
```

スレッドファイルだけを commit する。`main` には push しない。

```bash
git add business-ops/agent-dm/threads/
git commit -m "chore(agent-dm): <id> cursor → claude-code"
```

作業ブランチなら push してよい。相手が届けるには `git pull` が必要。

## 書いてよいこと / 禁止

- 書いてよい: 調査結果、レビュー、実装依頼、完了条件
- 禁止: 同じ実装を自分でもう一度やる、秘密情報、デプロイ、自分の直後のメッセージへの再返信
- 最後に書いたのが cursor なら止まる（CLI が拒否する）
- 8 ターン超えたら human 待ち。勝手に続けない

## 役割を入れ替えない

Cursor が頼む → Claude Code が実装・テスト → Cursor がレビュー。
レビューで直すのは Claude Code。Cursor が実装を奪わない。
