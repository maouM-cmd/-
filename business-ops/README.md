# 業務OS（business-ops）

ワークスペースの反復業務を AI とスクリプトで短縮するための資産置き場です。

## クイックスタート

### 新記事を作る

```bash
node business-ops/scripts/new-article.mjs --title "AIで残業を減らす3つの習慣" --slug ai-overtime-3
# Cursor で @article-production + ブリーフで執筆
node business-ops/scripts/article-qa.mjs articles/生成されたファイル.md
```

### coupon-board をデプロイ準備する

```bash
bash business-ops/scripts/pre-deploy-check.sh
# チェックリスト: business-ops/checklists/coupon-board-deploy.md
```

## ディレクトリ

```
business-ops/
├── README.md                 # 本ファイル
├── SOP.md                    # 日次・週次の手順
├── BUSINESS_MAP.md           # 業務マップ
├── AUTOMATION_CANDIDATES.md  # 改善案17件
├── scripts/
│   ├── new-article.mjs       # 記事骨組み生成
│   ├── article-qa.mjs        # 記事QA
│   ├── topic-dedup.mjs       # トピック重複チェック
│   └── pre-deploy-check.sh   # coupon-board検証
├── templates/
│   ├── article-brief.md      # 記事入力フォーム
│   └── prompts/              # コピペ用プロンプト
└── checklists/
    ├── article-publish.md
    └── coupon-board-deploy.md

.cursor/skills/
├── article-production/SKILL.md
└── coupon-board-dev/SKILL.md
```

## Cursor Skill の呼び方

| Skill | 呼び出し |
|-------|----------|
| 記事制作 | `@article-production` |
| 掲示板開発 | `@coupon-board-dev` |

## 安全ルール

- **投稿・公開・デプロイ・課金**は人間承認後のみ
- スクリプトは新規ファイル作成・読み取り検証が中心（破壊的操作なし）
- 不明点は実行前に確認

## 次に作ると効くもの

1. `to-note.mjs` — Note投稿用フォーマット変換
2. `content-calendar.json` — 公開スケジュール管理
3. 業務ハブ静的HTML — スクリプトを1画面から起動
