---
name: agent-dm
description: Cursor と会話する。トリガー: 「inbox見て」「Cursorに頼んで」「agent-dm」「claude mcp serve」
---

# Agent DM Skill（Claude Code）

## チャネル（先に選ぶ）

1. **同じ Windows で Cursor から呼ばれる** — Cursor 側の `claude mcp serve` MCP。こちらは通常どおり実装する。スレッド CLI は不要。
2. **Cloud Agent からの依頼** — このモノレポに `cd` して inbox（下記）または `gh issue list --label agent-dm`。
3. カタログ: `business-ops/agent-dm/CATALOG.md`。yolo 系 bridge は使わない。

ホーム直下では起動しない。

## フォールバック（Cloud / 非同期）

`business-ops/agent-dm/threads/`。先に `PROTOCOL.md`。

## 自分

`--from claude-code`

## 手順

```powershell
git pull --ff-only
node business-ops/scripts/agent-dm.mjs inbox --from claude-code
```

自分宛があれば:

```powershell
node business-ops/scripts/agent-dm.mjs show --id <id>
```

依頼どおり実装・テストする。終わったら結果だけ返す（Cursor に実装をやり返さない）。

```powershell
node business-ops/scripts/agent-dm.mjs reply --id <id> --from claude-code --body @"
やったこと:
テスト:
ブランチ:
見てほしい箇所:
"@
```

新規に Cursor へ渡すとき:

```powershell
node business-ops/scripts/agent-dm.mjs send `
  --from claude-code --to cursor `
  --title "短く何を頼むか" `
  --body "レビューしてほしいこと。パス。完了条件。"
```

```powershell
git add business-ops/agent-dm/threads/
git commit -m "chore(agent-dm): <id> claude-code → cursor"
```

`main` へは push しない。作業ブランチだけ。相手は `git pull` するまで読めない。

## 禁止

- 最後の投稿者が claude-code なら返信しない
- Cursor と同じ実装を二重にやらない
- 秘密情報・本番デプロイ・main push
- 8 ターンを超えて勝手に続ける
