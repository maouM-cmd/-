---
name: web-dev-github
description: Web開発の新規立ち上げから実装・GitHub投稿（commit/PR）までを一貫して行う。設計書先行・スコープ最小・危険操作は人間承認。
---

# Web開発 + GitHub投稿 Skill

## いつ使うか

- 新しいWebアプリ・機能を**ゼロから**作るとき（最大ボトルネック）
- 実装が終わって **GitHubに投稿**するとき
- PRの説明文・コミットメッセージを整えるとき

## 開発の型（このリポジトリの慣習）

```
project-name/
├── README.md           # 概要・セットアップ
├── REQUIREMENTS.md     # 要件定義（正）
├── BASIC_DESIGN.md     # 基本設計（必要時）
├── DETAILED_DESIGN.md  # 詳細設計（必要時）
├── IMPLEMENTATION.md   # 機能→ファイル対応表
├── AGENTS.md           # AI向けルール（フレームワーク注意）
├── src/                # ソース
└── package.json
```

雛形生成:
```bash
node business-ops/scripts/new-web-project.mjs --name my-app --type nextjs
```

## 新規開発フロー

```
1. project-brief.md を記入
2. new-web-project.mjs で骨組み生成
3. REQUIREMENTS.md を埋める（AI可）
4. 実装（スコープ最小）
5. ローカル確認（lint/build/dev）
6. github-preflight.sh
7. github-ship.mjs で文案生成
8. 人間承認後に commit / push / PR
```

## 技術スタック（既存プロジェクト参考）

| プロジェクト | スタック |
|-------------|----------|
| coupon-board | Next.js 16 + TS + Tailwind + SQLite |
| ai-dashboard-kit | 静的JSON + TS型 + コンテキスト生成 |

新規は **要件に応じて選定**。無断でスタックを変えない。

## GitHub投稿ルール

### ブランチ命名
```
cursor/<descriptive-name>-<suffix>
```

### コミットメッセージ
```
<type>: <要約（50字以内）>

<詳細（任意）>
```
type: `feat` | `fix` | `docs` | `chore` | `refactor` | `test`

### PR
- テンプレート: `.github/pull_request_template.md` に従う
- **draft PR** をデフォルト
- CI通過を確認してからレビュー依頼

## 人間承認が必要な操作

| 操作 | 理由 |
|------|------|
| `git push origin main` | 本番デプロイ連鎖の可能性 |
| PR merge | 本番反映 |
| 依存パッケージのメジャー更新 | 破壊的変更 |
| シークレット・APIキーの追加 | セキュリティ |
| Render/Vercel等の課金設定 | コスト発生 |
| 既存ファイルの大量削除 | データ消失 |

## 投稿前チェック

```bash
bash business-ops/scripts/github-preflight.sh
node business-ops/scripts/github-ship.mjs
```

チェックリスト: `business-ops/checklists/github-ship.md`

## プロンプト例

### 新機能実装
```
@web-dev-github

## プロジェクト
coupon-board/

## タスク
{機能説明}

## 制約
- REQUIREMENTS.md / IMPLEMENTATION.md を更新
- lint/build が通ること
- commit/push は行わない
```

### GitHub投稿準備
```
@web-dev-github

変更内容を確認し、github-ship.mjs 相当の
- コミットメッセージ案
- PRタイトル・本文案
を出してください。pushはまだしないでください。
```

## 関連Skill

- `@coupon-board-dev` — coupon-board 専用
- `@ai-agent-mastery` — エージェント活用の上級テクニック
