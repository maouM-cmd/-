# ai_company / CLAUDE.md に追記する断片

Claude Code のホームが `ai_company` のとき、Cursor との会話はこのモノレポ側で行う。

```
## Agent DM（Cursor との会話）

先に分類（`.claude/skills/agent-router`）。製品の相互DMは無い。

- 同じ PC: Cursor 仕事なら `agent -p`。Cursor から呼ばれる実装はそのままやる
- Cloud: このリポに cd → inbox または `gh issue list --label agent-dm`

「inbox 見て」:
1. ホーム直下では起動しない。`maouM-cmd/-` に cd
2. agent-router → 必要なら agent-dm
```
