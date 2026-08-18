---
name: agent-router
description: 依頼を実装する前に Cursor / Claude Code / 人間へ分類する。実装・テスト・日次SOPは Claude、UI・best-of-n・Cloud・レビューは Cursor、merge・デプロイは人間。相手の仕事なら自分では実装せず渡す。プロジェクト名が無くても UI/余白は coupon-board を既定にして渡す。
---

# Agent Router（共通）

どのツールに話しかけられても、**コードを書く前に分類する。** 自分の仕事でなければ実装しない。

判定の正: `business-ops/CURSOR_VS_CLAUDE.md`。配達の詳細: `business-ops/agent-dm/CATALOG.md` と `PROTOCOL.md`。相手の会話・思考・画面は読めない。渡すか、同じ git を読むかだけ。

## 判定表

| 判定 | 誰がやる | 例 |
|------|----------|-----|
| `claude-code` | 手元実装、テスト、Windows / PowerShell、日次 SOP | lint 修正、API、記事QAスクリプト、今日の1時間 |
| `cursor` | Design Mode / UI、`/best-of-n`、Cloud、Bugbot、Tab で足りる小修正 | 余白、Next.js 16 のモデル比較、スマホから直す |
| `human` | merge、本番デプロイ、課金、秘密情報 | main merge、Render、APIキー |
| `human`（迷い） | 実装しない。理由を書いて待つ | Cursor と Claude **両方**に見える仕事、危険操作 |

Tab で足りる小修正はエージェントを起動しない（Cursor エディタの仕事）。

**プロジェクト名が無いことは迷いではない。** 「どのプロジェクト？」と聞いて止まらない。

| 依頼の種類 | 既定のパス |
|------------|------------|
| 余白 / 見た目 / Design Mode / カード | `coupon-board/`（一覧 `DealCard`） |
| lint / API / 手元テストで対象不明 | 今開いているリポ。無ければモノレポの作業ツリー |

仮定は引き渡し文に 1 行書く。人間が別プロジェクトだと言ったらそちらへ付け替える。

## いま自分はどちらか

- Cursor のセッション → 自分は `cursor`
- Claude Code のセッション → 自分は `claude-code`

相手から Agent DM / Issue で渡された仕事は、**判定をやり直して役割を入れ替えない。** やって結果を返す。

## 引き渡し

自分の判定と自分の役割が一致 → やる。

不一致:

1. **同じ PC で相手が使える**
   - Cursor → Claude: `claude-code` MCP（`claude mcp serve`）。無ければ下記 2。
   - Claude → Cursor: `agent -p "依頼。完了条件。触ってよいパス。"`（Cursor CLI）。`agent` が無ければ下記 2。
2. **Cloud / コマンド無し** → `@agent-dm` で `send` して止まる。GitHub Issue（`gh`）でもよい。
3. 渡したら **自分では実装しない。** 同じ実装を二重にやらない。

yolo / skip-permissions の MCP は使わない。コミット済み `.cursor/mcp.json` は作らない（Cloud に `claude` が無い）。

## 判定例

| 依頼 | 判定 | 動き |
|------|------|------|
| coupon-board の lint を直して | claude-code | Cursor なら MCP か agent-dm。Claude なら実装 |
| 余白を直して（プロジェクト名なし） | cursor | 既定 `coupon-board` の `DealCard`。Claude は聞かずに `agent -p`。Cursor なら実装 |
| 一覧カードの余白を揃えて | cursor | Claude なら `agent -p` か agent-dm。Cursor なら Design Mode |
| Next.js 16 の params を複数モデルで当てて | cursor | `/best-of-n`。Claude は渡す |
| 本番にデプロイして | human | どちらも実装しない。承認を待つ |

Claude → Cursor のコピペ（プロジェクト未指定の余白）:

```powershell
agent -p "coupon-board の一覧カード（DealCard）の余白を他カードと揃えて。触ってよい: coupon-board/src/components/DealCard.tsx と一覧グリッド。完了条件: 同じ行のカードの高さと内部余白が揃う。リファクタ禁止。聞かないで進めて。"
```
