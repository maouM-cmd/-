# 業務OS（business-ops）

ワークスペースの反復業務を AI とスクリプトで短縮するための資産置き場です。

## クイックスタート（全自動モード）

```bash
node business-ops/scripts/autopilot.mjs check
node business-ops/scripts/autopilot.mjs new --name my-app --type nextjs
# brief 記入 → Cursor で @autopilot
node business-ops/scripts/autopilot.mjs ship --yes   # commit→push→draft PR
```

## クイックスタート（手動モード）

### 新プロジェクトを作る

```bash
node business-ops/scripts/new-web-project.mjs --name my-app --type nextjs
# Cursor で @web-dev-github + templates/project-brief.md
```

### GitHubに投稿する

```bash
bash business-ops/scripts/github-preflight.sh
node business-ops/scripts/github-ship.mjs
# 文案確認 → commit → push → draft PR
```

### 記事を作る（副業・必要時）

```bash
node business-ops/scripts/new-article.mjs --title "..." --slug my-slug
# @article-production → article-qa.mjs
```

### coupon-board デプロイ準備

```bash
bash business-ops/scripts/pre-deploy-check.sh
```

## ディレクトリ

```
business-ops/
├── README.md
├── SOP.md
├── AI_AGENT_MASTERY.md       # マスターへの道筋
├── BUSINESS_MAP.md
├── AUTOMATION_CANDIDATES.md
├── scripts/
│   ├── new-web-project.mjs   # 新規Webプロジェクト骨組み
│   ├── github-preflight.sh   # 投稿前安全チェック
│   ├── github-ship.mjs       # コミット/PR文案生成
│   ├── new-article.mjs
│   ├── article-qa.mjs
│   ├── topic-dedup.mjs
│   └── pre-deploy-check.sh
├── templates/
│   ├── project-brief.md      # 新規開発入力フォーム
│   ├── article-brief.md
│   ├── agent-retrospective.md
│   └── prompts/
├── checklists/
│   ├── github-ship.md
│   ├── article-publish.md
│   └── coupon-board-deploy.md
└── briefs/

.cursor/skills/
├── web-dev-github/SKILL.md
├── ai-agent-mastery/SKILL.md
├── article-production/SKILL.md
└── coupon-board-dev/SKILL.md

.github/
├── pull_request_template.md
└── ISSUE_TEMPLATE/
```

## Cursor Skill の呼び方

| Skill | 呼び出し |
|-------|----------|
| **全自動** | `@autopilot` |
| **Web開発 + GitHub** | `@web-dev-github` |
| **エージェントマスター** | `@ai-agent-mastery` |
| 記事制作 | `@article-production` |
| 掲示板開発 | `@coupon-board-dev` |

## 安全ルール

- **投稿・公開・デプロイ・課金**は人間承認後のみ
- スクリプトは新規ファイル作成・読み取り検証が中心（破壊的操作なし）
- 不明点は実行前に確認

## 次に作ると効くもの

1. `gh` CLI 連携 — PR作成まで半自動（人間承認ゲート付き）
2. 業務ハブ静的HTML — スクリプトを1画面から起動
3. E2Eテスト — coupon-board リグレッション防止
