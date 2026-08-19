<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Agent Rules — todoku

- 要件の正は `REQUIREMENTS.md`
- 既存の `optimal-match/` は変更しない
- コア判定はルール＋スコア。生成AIに適格判定を任せない
- カタログ外データのスクレイプ禁止
- 破壊的変更・本番デプロイ・課金は人間承認後のみ
