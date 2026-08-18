---
name: agent-dm
description: ルーター判定のあと、相手エージェントへ配達する。inbox・send・reply。同じPCの MCP/CLI が使えるときは使わない。
---

# Agent DM Skill（Cursor）— 配達

**先に `@agent-router`。** 分類が自分（cursor）ならここで配達しない。相手（claude-code）へ渡すチャネルだけがこの Skill。

## チャネル

1. 同じ Windows で `claude-code` MCP が生きている → MCP で渡す。この CLI は使わない。
2. Cloud / MCP 無し → スレッドまたは `gh issue`。

yolo / skip-permissions は使わない。詳細: `business-ops/agent-dm/CATALOG.md` と `PROTOCOL.md`

## 自分

`--from cursor`

## 手順

```bash
git pull --ff-only
node business-ops/scripts/agent-dm.mjs inbox --from cursor
```

inbox があれば `show` → ルーターどおり作業（渡された実装は奪わない。レビューならレビュー）→ `reply`。

新規に Claude へ渡すとき:

```bash
node business-ops/scripts/agent-dm.mjs send \
  --from cursor --to claude-code \
  --title "短く何を頼むか" \
  --body "やってほしいこと。完了条件。触ってよいパス。禁止事項。"
```

```bash
git add business-ops/agent-dm/threads/
git commit -m "chore(agent-dm): <id> cursor → claude-code"
```

`main` には push しない。作業ブランチなら push してよい。

## 禁止

- ルーターを飛ばして実装する
- 最後に書いたのが cursor なら再返信しない
- 秘密情報・デプロイ・8 ターン超えて続ける
