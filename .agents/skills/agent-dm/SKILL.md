---
name: agent-dm
description: ルーター判定のあと Cursor へ配達する。トリガー: inbox見て、Cursorに頼んで、agent-dm。同じPCで agent -p が使えるときは使わない。
---

# Agent DM Skill（Codex）— 配達

**先に `@agent-router`（または `.Codex/skills/agent-router`）。** 分類が自分（Codex）なら実装する。Cursor へ渡すチャネルだけがこの Skill。

ホーム直下では起動しない。このモノレポに `cd` する。

## チャネル

1. 同じ Windows で `agent` がある → `agent -p "..."` 。この CLI は使わない。
2. Cloud Agent からの依頼 / `agent` 無し → inbox（下記）または `gh issue list --label agent-dm`。

カタログ: `business-ops/agent-dm/CATALOG.md`。yolo は使わない。

## 自分

`--from Codex`

## 手順

```powershell
git pull --ff-only
node business-ops/scripts/agent-dm.mjs inbox --from Codex
node business-ops/scripts/agent-dm.mjs show --id <id>
```

渡された実装はやって結果だけ返す。Cursor に実装をやり返さない。

```powershell
node business-ops/scripts/agent-dm.mjs reply --id <id> --from Codex --body @"
やったこと:
テスト:
ブランチ:
見てほしい箇所:
"@
```

新規に Cursor へ（`agent` が使えないとき）:

```powershell
node business-ops/scripts/agent-dm.mjs send `
  --from Codex --to cursor `
  --title "短く何を頼むか" `
  --body "レビューしてほしいこと。パス。完了条件。"
```

```powershell
git add business-ops/agent-dm/threads/
git commit -m "chore(agent-dm): <id> Codex → cursor"
```

`main` へは push しない。

## 禁止

- ルーターを飛ばす
- 最後の投稿者が Codex なら返信しない
- 秘密情報・本番デプロイ・8 ターン超過
