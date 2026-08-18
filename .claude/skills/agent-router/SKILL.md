---
name: agent-router
description: 実装前に Cursor / Claude Code / 人間へ分類する。実装・テスト・日次SOPは自分（Claude）。UI・best-of-n・Cloud・レビューは Cursor へ渡す。merge・デプロイは人間。相手の仕事は実装しない。トリガー: 分類して、渡して、これはCursor、これはClaude。
---

# Agent Router（共通）

どのツールに話しかけられても、**コードを書く前に分類する。** 自分の仕事でなければ実装しない。

判定の正: `business-ops/CURSOR_VS_CLAUDE.md`。配達: `business-ops/agent-dm/CATALOG.md` と `PROTOCOL.md`。ホーム直下では起動しない。このモノレポに `cd` してから分類する。

## 判定表

| 判定 | 誰がやる | 例 |
|------|----------|-----|
| `claude-code` | 手元実装、テスト、Windows / PowerShell、日次 SOP | lint 修正、API、記事QA、今日の1時間 |
| `cursor` | Design Mode / UI、`/best-of-n`、Cloud、Bugbot、Tab で足りる小修正 | 余白、Next.js 16 のモデル比較、スマホから直す |
| `human` | merge、本番デプロイ、課金、秘密情報 | main merge、Render、APIキー |
| `human`（迷い） | 実装しない。理由を書いて待つ | 両方に見える、範囲が不明 |

## いま自分はどちらか

Claude Code のセッション → 自分は `claude-code`。

相手から Agent DM / Issue で渡された仕事は、**判定をやり直して役割を入れ替えない。** やって結果を返す。

## 引き渡し

自分の判定が `claude-code` → やる。

`cursor` の仕事:

1. 同じ PC で `agent` がある → `agent -p "依頼。完了条件。触ってよいパス。"` して自分は実装しない
2. 無い / Cloud 相当 → `node business-ops/scripts/agent-dm.mjs send --from claude-code --to cursor ...` して止まる。`gh issue` でもよい

`human` の仕事: 実装しない。承認を待つ。

yolo / skip-permissions は使わない。

## 判定例

| 依頼 | 判定 | 動き |
|------|------|------|
| coupon-board の lint を直して | claude-code | 自分が実装する |
| 一覧カードの余白を揃えて | cursor | `agent -p` か agent-dm。自分は UI を書かない |
| Next.js 16 の params を複数モデルで当てて | cursor | Cursor の `/best-of-n` に渡す |
| 本番にデプロイして | human | 止める |
