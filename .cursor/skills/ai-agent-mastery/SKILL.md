---
name: ai-agent-mastery
description: Cursor/Fableエージェントを最大限活用し「最強AIエージェントマスター」を目指すための思考法・委任パターン・プロンプト設計・振り返りルール。
---

# 最強AIエージェントマスター Skill

## ゴール

> 人間は**判断**だけ。実装・文案・調査・定型作業はエージェントに任せる。

## ツール分担（Cursor vs Claude Code）

Cursor を Claude Code の代わりにしない。手元実装は Claude Code、Cursor は Tab / Cloud Agent / Bugbot / Automations / `/best-of-n`。

| 任せる作業 | ツール |
|------------|--------|
| 手元の実装・テスト・提出 | Claude Code |
| 小さな修正（エージェント起動なし） | Cursor Tab / Cmd+K |
| UI クリック修正 | Cursor Design Mode |
| 非同期・スマホ・並列 | Cursor Cloud Agent |
| PR 監査・CI 失敗修正 | Bugbot / Automations |
| モデル比較（Next.js 16 など） | Cursor `/best-of-n` |
| 日次 SOP（朝チェック・1時間） | Claude Code skills |
| 相手エージェントへ依頼 | Agent DM（`@agent-dm`） |

詳細: `business-ops/CURSOR_VS_CLAUDE.md`

## 5つの原則

### 1. 型を先に作る（再発明を禁止する）
- 毎回ゼロから説明しない → **Skill / テンプレ / スクリプト**に固定
- 新しいパターンが出たら、その場でSkillに追記する

### 2. 入力フォームを必ず挟む
- 口頭の曖昧な指示より `project-brief.md` / `article-brief.md`
- **入力が足りないときは推測で進め、仮定を明示**

### 3. 委任の粒度を決める

| 任せる | 人間がやる |
|--------|-----------|
| コード生成・リファクタ | 要件の優先順位 |
| 設計書ドラフト | 最終仕様の承認 |
| コミット/PR文案 | push / merge の承認 |
| 調査・比較 | 技術選定の最終判断 |
| テストコード生成 | 本番デプロイ |

### 4. 安全柵をSkillに埋め込む
- 破壊的操作・課金・投稿は **「人間承認必須」** とSkillに明記
- preflightスクリプトで機械チェック

### 5. 週1でSkillを更新する
- うまくいったプロンプト → テンプレに昇格
- 失敗パターン → Skillの「禁止」に追記

## エージェント委任パターン（コピペ用）

### パターンA: 調査→実装（2段階）
```
Phase 1（調査のみ）:
「{対象}を調査し、選択肢3つと推奨1つを表で出してください。コードは書かないでください。」

Phase 2（実装）:
「推奨案で実装してください。@web-dev-github に従い、スコープ最小で。」
```

### パターンB: 骨組み→肉付け
```
Step 1: new-web-project.mjs / new-article.mjs で骨組み
Step 2: @対象Skill + ブリーフで中身を埋める
Step 3: QAスクリプト → 人間確認
```

### パターンC: レビュー委任
```
「今の変更の diff をレビューし、
- バグリスク
- スコープ外の変更
- テスト不足
を箇条書きで。修正はまだしないでください。」
```

### パターンD: 並列委任（独立タスク）
```
タスク1: 「REQUIREMENTS.md を要件に沿って更新」
タスク2: 「IMPLEMENTATION.md の対応表を更新」
→ 独立なら同時依頼、依存ありなら順番に
```

### パターンE: Cursor → Claude Code（Agent DM）
```
@agent-dm
Claude Code に渡す。実装は向こう。こちらはレビューだけ。
完了条件と触ってよいパスを --body に書く。
```

## Skillの組み合わせ

| シーン | 呼び出すSkill |
|--------|--------------|
| 新Webアプリ | `@web-dev-github` |
| coupon-board | `@coupon-board-dev` |
| 記事執筆 | `@article-production` |
| エージェント設計 | `@ai-agent-mastery`（本Skill） |
| 全自動 ship | `@autopilot` |
| Cursor と Claude の会話 | `@agent-dm` |
| ツール分担の確認 | `business-ops/CURSOR_VS_CLAUDE.md` |

## 週次振り返りテンプレート

`business-ops/templates/agent-retrospective.md` をコピーして記入。

## マスターへのレベル指標

| Level | 状態 | あなたの現在地（推定） |
|-------|------|----------------------|
| L1 | 都度プロンプト | ← 以前 |
| L2 | Skill + テンプレ活用 | **← 今ここ** |
| L3 | スクリプトで投稿半自動 | 今回追加中 |
| L4 | エージェントが自律完走→人間は承認のみ | 目標 |
| L5 | 複数エージェント並列 + 自己改善ループ | 最強 |

## 詳細プレイブック

- `business-ops/AI_AGENT_MASTERY.md`
- `business-ops/CURSOR_VS_CLAUDE.md` — Cursor の存在意義と、Claude Code との使い分け
- `business-ops/agent-dm/PROTOCOL.md` — エージェント同士の会話
