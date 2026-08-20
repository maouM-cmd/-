# ops-dx / Dify ファイル受け渡し

ブラウザで Studio を操作する代わりに、DSL と KB をここに置く。

- 渡す場所: `ops-dx/INBOX/`
- 返ってくる場所: `ops-dx/OUTBOX/`
- 手順: `.cursor/skills/dify-file-handoff/SKILL.md`

エージェントへの依頼例:

```
@dify-file-handoff
ops-dx/INBOX の DSL を読んで theme_finder_practice の critic / クエリ書き換えを直して。
OUTBOX に編集済み YAML と TEST_CASES.md を出して。Studio は触らない。
```
