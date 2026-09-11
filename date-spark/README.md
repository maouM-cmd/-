# デートスパーク（DATE SPARK）

既存カップルのマンネリを、店リストではなく **今夜の動詞1つ** で破る Web アプリ。

制作基盤（プロンプト・要件ロック）が先。本体実装は Claude Code が `business-ops/templates/prompts/hackathon-24/01-claude-mvp.md` を貼って行う。

## 一句

今夜の動詞は一つだけ。マンネリは店不足ではない。脚本を破る夜だ。

## セットアップ（実装後）

```bash
cd date-spark
npm ci
# Gemini を使うときだけ
# copy env.example .env.local
npm run dev
```

http://localhost:3002 （PORT=3002 を推奨）

## ドキュメント

- [REQUIREMENTS.md](./REQUIREMENTS.md) — 正（ロック稿）
- [BASIC_DESIGN.md](./BASIC_DESIGN.md)
- [IMPLEMENTATION.md](./IMPLEMENTATION.md)
- 貼る文: `../business-ops/templates/prompts/hackathon-24/`

## やらない

チャットプランナー、Maps、optimal-match のフォーク、本番デプロイ（人間承認なし）
