# ai_company / CLAUDE.md に追記する断片

Claude Code のホームが `ai_company` のとき、Cursor との会話はこのモノレポ側で行う。

```
## Agent DM（Cursor との会話）

公式の相互DMは無い。会話口はリポジトリ `maouM-cmd/-` の `business-ops/agent-dm/`。

「inbox 見て」「Cursor に頼んで」と言われたら:
1. ホーム直下では起動しない。`maouM-cmd/-` に cd する
2. `business-ops/agent-dm/PROTOCOL.md` と `.claude/skills/agent-dm/SKILL.md` に従う
3. `node business-ops/scripts/agent-dm.mjs inbox --from claude-code`
```
