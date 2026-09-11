---
name: autopilot
description: 全自動モード。新規プロジェクト立ち上げから実装完了後の commit/push/draft PR まで人間の介入を最小化。危険操作（main push・課金・デプロイ・外部投稿）は禁止。
---

# Autopilot Skill（全自動）

## ゴール

> **人間はブリーフを書くだけ。あとはエージェントが完走して GitHub に draft PR まで出す。**

## いつ使うか

- 「全自動でやって」と言われたとき
- 実装完了後の GitHub 投稿を自動化するとき
- 新規プロジェクトを一気に立ち上げるとき

## 全自動フロー

```
1. autopilot new --name my-app
2. brief を埋める（唯一の人間作業）
3. @autopilot で実装
4. autopilot ship --yes  （エージェントが自動実行）
```

## エージェントの完了時ルール（必須）

実装・修正が完了したら **必ず** 以下を実行:

```bash
node business-ops/scripts/autopilot.mjs check
node business-ops/scripts/autopilot.mjs ship --yes
```

失敗したら修正して再実行。人間に「pushしていいですか？」と聞かない。

## コマンド一覧

| コマンド | 動作 |
|----------|------|
| `autopilot check` | git/gh/node 確認 |
| `autopilot new --name X` | branch + scaffold + brief + プロンプト生成 |
| `autopilot ship --yes` | preflight → commit → push → draft PR |
| `autopilot full --name X` | new + エージェント指示書 |

## 自動化レベル（config/autopilot.json）

| Level | 動作 |
|-------|------|
| L1 | auto commit のみ |
| L2 | commit + push + draft PR（**デフォルト**） |
| L3 | + CI通過後 auto-merge（`auto_merge: true` で有効） |

## 絶対禁止（全レベル共通）

| 操作 | 理由 |
|------|------|
| `main` / `master` への push | 本番直結 |
| force push | 破壊的 |
| シークレットのコミット | 漏洩 |
| Render/Vercel デプロイ | 課金 |
| Note/SNS 投稿 | 誤投稿 |
| `published: true` | 公開判断 |

## プロンプト例（全自動開発）

```
@autopilot @web-dev-github

business-ops/briefs/{name}-brief.md を読み、{name}/ を MVP まで実装。
完了後:
  node business-ops/scripts/autopilot.mjs ship --yes
```

## 関連

- Config: `business-ops/config/autopilot.json`
- SOP: `business-ops/SOP.md`（Autopilot セクション）
- マスター: `@ai-agent-mastery`
