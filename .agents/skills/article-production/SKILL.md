---
name: article-production
description: Note向けAI活用・副業記事の企画・執筆・QA・公開準備を一貫して行う。articles/ の既存記事パターンに従う。
---

# 記事制作 Skill

## いつ使うか

- `articles/` に新しい記事を追加・改稿するとき
- Note / 有料記事 / Gumroad CTA を含むコンテンツを作るとき
- 記事の品質チェック・公開前確認をするとき

## 必ず読む参照

1. 既存記事2〜3本（特に `articles/20260701-0610-aichatgpt35.md` を型として参照）
2. `business-ops/templates/article-brief.md`（入力があれば）
3. `business-ops/checklists/article-publish.md`（公開前）

## 記事の型（固定構造）

```markdown
---
title: "記事タイトル"
emoji: "🌟"
type: "idea"
topics: ["AI", "副業", "ChatGPT", "生産性向上"]
published: false
---

## {タイトルと同じ見出し}

## なぜ多くの人が{テーマ}で結果を出せないのか
（読者の悩み・共感・「明確な理由がある」への橋渡し）

## {テーマ}で成果を出す人が密かにやっている3つのこと

### ① {ポイント1}
- なぜ効くのか：
- 具体的にやること：
- 実践例：
- すぐできる一歩：

### ② {ポイント2}
（同上）

### ③ {ポイント3}
（同上）

ここまでは基本です。ただ、ほとんどの人はここで止まります。

## 🎁 コピペで使える実践テンプレートを手に入れる
**→ [Note.comで月収5万円を達成するための実践ガイド](https://springharu.gumroad.com/l/yariyy)**
✅ コピペで今日から使える　✅ ¥2400（コーヒー1杯分）

---

*続きは [note.com の有料記事](https://note.com) でお読みいただけます。*
```

## ファイル命名規則

```
articles/YYYYMMDD-HHMM-{slug}.md
```

- `slug`: 英小文字・数字・ハイフンのみ、20文字以内推奨
- 生成コマンド: `node business-ops/scripts/new-article.mjs --title "..." --slug ...`

## トーン・文体

- 一人称「私」、読者への語りかけ
- 具体例は「Aさん」「友人」など匿名
- 数字は「約」「〜」で柔らかく（検証不能な断定は避ける）
- 煽りすぎず、共感→解決→行動の流れ

## 禁止・要確認（人間承認必須）

| 操作 | 理由 |
|------|------|
| `published: true` への変更 | 公開意思の確認 |
| Note / SNS への実投稿 | 誤投稿防止 |
| Gumroad URL の変更 | リンク切れ・課金導線 |
| 事実と異なる具体的数値の断定 | 信頼性 |
| 他者の固有名・商標の誤用 | 法的リスク |

## 作業フロー

```
1. ブリーフ記入（templates/article-brief.md）
2. new-article.mjs で骨組み生成
3. 本文執筆（このSkillの型に従う）
4. article-qa.mjs で機械チェック
5. チェックリストで人間確認
6. published: true は人間が明示承認後のみ
```

## QAコマンド

```bash
node business-ops/scripts/article-qa.mjs articles/対象ファイル.md
node business-ops/scripts/article-qa.mjs --all
```

## プロンプト例（ブリーフから執筆）

```
@article-production

以下のブリーフに従い、articles/ の既存記事と同じ型で本文を書いてください。
- 3つのポイントは重複しないこと
- CTAセクションはテンプレのまま
- published は false のまま

{ブリーフ本文を貼る}
```
