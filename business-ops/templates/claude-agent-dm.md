# ai_company / CLAUDE.md に追記する断片

Claude Code のホームが `ai_company` のとき、Cursor との会話はこのモノレポ側で行う。

```
## Agent DM（Cursor との会話）

製品の相互DMは無い。先に `maouM-cmd/-` の `business-ops/agent-dm/CATALOG.md`。

- 同じ PC: Cursor が `claude mcp serve` でこちらを呼ぶ。inbox CLI は不要
- Cloud から: このリポに cd → `PROTOCOL.md` → inbox または `gh issue list --label agent-dm`

「inbox 見て」と言われたら:
1. ホーム直下では起動しない。`maouM-cmd/-` に cd する
2. `.claude/skills/agent-dm/SKILL.md` に従う
```
