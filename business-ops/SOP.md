# 業務OS 標準作業手順（SOP）

> 主業務: Web開発 / くり返し: GitHub投稿 / ゴール: 最強AIエージェントマスター

## 日次: 全自動モード（推奨）

```bash
# 環境確認（初回のみ）
node business-ops/scripts/autopilot.mjs check

# 新規プロジェクト全自動立ち上げ
node business-ops/scripts/autopilot.mjs new --name my-app --type nextjs
# → brief を埋める → Cursor で @autopilot

# 実装完了後（エージェントが自動実行）
node business-ops/scripts/autopilot.mjs ship --yes
# → preflight → commit → push → draft PR まで全自動
```

### 自動化レベル

| Level | 内容 | 設定 |
|-------|------|------|
| L2 | commit + push + draft PR | デフォルト |
| L3 | + CI通過後 auto-merge | `autopilot.json` で `auto_merge: true` + PRに `autopilot-merge` ラベル |

## 日次: Web開発 + GitHub投稿（手動モード）

### A. 新規成果物を作る日

1. **ブリーフ（5分）** — `templates/project-brief.md` を記入
2. **骨組み（1分）**
   ```bash
   node business-ops/scripts/new-web-project.mjs --name my-app --type nextjs
   ```
3. **実装（30〜90分）** — Cursor で `@web-dev-github` + ブリーフ
4. **ローカル確認** — lint / build / dev
5. **投稿準備（5分）**
   ```bash
   bash business-ops/scripts/github-preflight.sh
   node business-ops/scripts/github-ship.mjs
   ```
6. **投稿（人間承認後）** — `checklists/github-ship.md` → commit → push → draft PR

### B. 既存プロジェクトを直す日

1. Issue or 要件を1行で整理
2. `@coupon-board-dev` or `@web-dev-github` + 要件
3. ローカル確認
4. A-5, A-6 と同じ投稿フロー

## 日次: 記事（副業・必要時のみ）

1. `templates/article-brief.md` → `new-article.mjs` → `@article-production` → `article-qa.mjs`

## 週次: エージェントマスター振り返り（15分）

1. `templates/agent-retrospective.md` を記入
2. うまくいったプロンプト → Skill or テンプレに昇格
3. `AI_AGENT_MASTERY.md` のレベル指標を確認

## 週次: coupon-board メンテ（必要時）

1. `@coupon-board-dev` + 要件
2. `pre-deploy-check.sh` → PR → `checklists/coupon-board-deploy.md`

## 危険操作の原則

| 操作 | 誰がやるか |
|------|-----------|
| git push / PR merge | 人間承認後 |
| main 直接 push | 原則禁止 |
| 本番デプロイ / Render課金 | 人間のみ |
| Note/SNS投稿 | 人間のみ |
| APIキー・シークレット | 人間のみ |

## 困ったとき

| 症状 | 対処 |
|------|------|
| 新規着手が遅い | `new-web-project.mjs` + `project-brief.md` |
| 投稿文案に悩む | `github-ship.mjs` |
| シークレットが不安 | `github-preflight.sh` |
| エージェントの使い方 | `@ai-agent-mastery` |
| Next.jsエラー | `@coupon-board-dev` + AGENTS.md |
