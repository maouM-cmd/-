---
name: dify-file-handoff
description: Dify / ops-dx の Chatflow をブラウザ操作せず、DSL・KB・実行ログのファイル受け渡しで直す。theme_finder、CRITIC、Self-RAG、agenticRAG の改修時に使う。
---

# Dify はファイルで渡す

## ゴール

> エージェントは Dify Studio を触らない。人間はエクスポート / インポートだけ。差分は git 上の YAML・Markdown で直す。

## いつ使うか

- Dify（cloud.dify.ai）の Chatflow / Workflow を直すとき
- `theme_finder_practice` / critic / selfRAG / agenticRAG / ops-dx
- 「ブラウザで確認して」より「ファイルで」と言われたとき

## 禁止

- Dify Studio のブラウザ操作（プレビュー送信、ノード編集、公開）
- Publish / 公開する / Upgrade / 課金
- 本番ワークスペースへのインポート（人間のみ）

人間がやること: Studio で DSL を書き出す、直した DSL を取り込む、必要なら Preview。

## 人間が渡すファイル（最短）

`ops-dx/INBOX/` に置く。名前はアプリ名が分かればよい。

| 必須 | パス | 取り方 |
|------|------|--------|
| DSL YAML | `ops-dx/INBOX/dsl/<app>.yml` | アプリ → オーケストレート → メニュー「DSL をエクスポート」 |
| KB 本文 | `ops-dx/INBOX/kb/INC-01.md` など | ナレッジの元ファイル。複数なら全部 |

| あると速い | パス | 取り方 |
|------------|------|--------|
| 設計 | `ops-dx/INBOX/DESIGN.md` `ROADMAP.md` | Claude Code 側の原本 |
| 失敗した実行 | `ops-dx/INBOX/runs/<app>-<case>.txt` | ノードの「最後の実行」をコピー |

Preview のスクショは不要。テキストの last-run の方が速い。

## エージェントが返すファイル

| パス | 中身 |
|------|------|
| `ops-dx/OUTBOX/dsl/<app>.yml` | 編集済み DSL。Studio で「DSL をインポート」 |
| `ops-dx/OUTBOX/PATCH.md` | どのノードのどのプロンプトをどう変えたか |
| `ops-dx/OUTBOX/TEST_CASES.md` | 人間が Preview するクエリと期待経路 |

インポート後の Publish は人間が判断する。エージェントは「公開して」と言われない限り Publish しない（そもそも Studio を開かない）。

## 改修の見方

1. INBOX の DSL を読む（ノード名・IF 条件・プロンプト・知識検索の dataset）
2. KB 本文と照合（ヒットすべきクエリが本文に存在するか）
3. クエリ書き換えが本文の語彙を壊していないか（例: 障害 → 症状/治療）
4. CRITIC が空 `[]` を `incorrect` に固定できるか
5. OUTBOX に DSL + PATCH + TEST_CASES を出す

## 既知の失敗（practice 2026-08-20）

- Test A `容量不足による障害`: 書き換えが医療語になり、知識検索 `[]` → critic `incorrect` → 回答 2
- Test B `有給の残日数を教えて`: 検索 `[]` なのに critic `correct` → LLM 2 / SELFRAG まで実行。断り文は出るが経路が違う
- `theme_finder_agentic` は SANDBOX から消えている。代替は `theme_finder_multiagent_rag` / `hypothesis_rag` の DSL を渡す

詳細: `ops-dx/theme_finder_practice/OBSERVED.md`
