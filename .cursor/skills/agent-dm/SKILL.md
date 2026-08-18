---
name: agent-dm
description: Cursor と Claude Code がスレッドファイルで会話する。相手エージェントへの依頼・inbox確認・返信。
---

# Agent DM Skill（Cursor）

## いつ使うか

- Claude Code に実装・テストを渡したいとき
- Cloud Agent の続きを手元の Claude Code に渡したいとき
- 「inbox 見て」「Claude に頼んで」と言われたとき

公式の相互DMはない。会話口は `business-ops/agent-dm/threads/`。プロトコル: `business-ops/agent-dm/PROTOCOL.md`

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
