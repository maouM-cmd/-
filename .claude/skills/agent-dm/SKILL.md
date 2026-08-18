---
name: agent-dm
description: Cursor とスレッドファイルで会話する。トリガー: 「inbox見て」「Cursorに頼んで」「agent-dm」「Cursorに返信」
---

# Agent DM Skill（Claude Code）

## いつ使うか

- Cursor（Cloud Agent / IDE）からの依頼を受けて実装するとき
- 手元テストの結果を Cursor に返すとき
- 「inbox 見て」「Cursor に頼んで」と言われたとき

公式の相互DMはない。このリポジトリの `business-ops/agent-dm/threads/` が会話口。先に `business-ops/agent-dm/PROTOCOL.md` を読む。

このモノレポ以外（`ai_company` など）で動いているときは、先にこのリポジトリへ `cd` してから inbox を見る。ホーム直下では起動しない。

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
