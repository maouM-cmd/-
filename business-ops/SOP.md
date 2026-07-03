# 業務OS 標準作業手順（SOP）

## 日次: 記事を1本進める（30〜60分）

1. **企画（5分）** — `templates/article-brief.md` をコピーして記入
2. **骨組み（1分）**
   ```bash
   node business-ops/scripts/new-article.mjs --title "タイトル" --slug my-slug --emoji "💰"
   ```
3. **執筆（20〜40分）** — Cursor で `@article-production` + ブリーフ
4. **QA（5分）**
   ```bash
   node business-ops/scripts/article-qa.mjs articles/新ファイル.md
   ```
5. **人間確認（5分）** — `checklists/article-publish.md`
6. **公開** — `published: true` と Note投稿は**あなたが明示承認したときのみ**

## 週次: coupon-board メンテ（必要時）

1. Issue / 要望を整理
2. Cursor で `@coupon-board-dev` + 要件
3. ローカル確認: `cd coupon-board && npm run dev`
4. PR作成 → CI通過確認
5. デプロイは `checklists/coupon-board-deploy.md` に従う

## 週次: 記事企画バッチ（15分）

1. 既存記事のトピック確認
   ```bash
   node business-ops/scripts/topic-dedup.mjs --query "新テーマキーワード"
   ```
2. 被りが少ないテーマを3つ選ぶ
3. ブリーフを `business-ops/briefs/` に保存

## 月次: ai-dashboard-kit 更新

```bash
# data/*.json を編集後
node ai-dashboard-kit/scripts/generate-claude-context.mjs
```

## 危険操作の原則

| 操作 | 誰がやるか |
|------|-----------|
| Note/SNS投稿 | 人間のみ |
| main push / Renderデプロイ | 人間承認後 |
| published: true | 人間のみ |
| APIキー・課金設定 | 人間のみ |
| 本番DB変更 | 人間のみ |

## 困ったとき

| 症状 | 対処 |
|------|------|
| 記事の型がブレる | `@article-production` を明示 |
| Next.jsで変なエラー | `@coupon-board-dev` + AGENTS.md 参照 |
| QAエラー | `article-qa.mjs` の ERROR を1つずつ修正 |
| デプロイ失敗 | CIログ → `pre-deploy-check.sh` ローカル再現 |
