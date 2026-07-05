# GitHub投稿前チェックリスト

## 機械チェック（必須）

```bash
bash business-ops/scripts/github-preflight.sh
node business-ops/scripts/github-ship.mjs
```

- [ ] preflight エラー 0 件
- [ ] コミットメッセージを確認・編集した
- [ ] PR本文を確認・編集した

## コード品質

- [ ] ローカルで動作確認した
- [ ] lint / build が通る（該当プロジェクト）
- [ ] スコープ外の変更がない

## セキュリティ

- [ ] `.env` / APIキー / パスワードをコミットしていない
- [ ] 管理画面のデフォルトパスワードを本番で変更済み（該当時）

## ドキュメント

- [ ] REQUIREMENTS / IMPLEMENTATION を更新した（仕様変更時）
- [ ] README のセットアップ手順が正しい

## 投稿（人間承認必須）

- [ ] ブランチ名が適切（`cursor/...` 推奨）
- [ ] **draft PR** で作成する
- [ ] `main` への直接 push は意図的か確認した
- [ ] 本番デプロイが連鎖する場合、タイミングを確認した

## 投稿後

- [ ] CI が green になることを確認
- [ ] PR URL を記録
- [ ] 必要ならレビュー依頼

## やってはいけないこと

- 人間承認なしの `git push origin main`
- シークレットを含むコミット
- CI失敗のまま merge
