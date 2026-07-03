# coupon-board デプロイ前チェックリスト

## 自動検証（必須）

```bash
bash business-ops/scripts/pre-deploy-check.sh
```

- [ ] lint 成功
- [ ] build 成功
- [ ] verify-prod（あれば）成功

## コード・設計

- [ ] IMPLEMENTATION.md を更新した（機能追加時）
- [ ] 破壊的DB変更がない、またはマイグレーション手順がある
- [ ] 管理画面パスワードが本番用に変更済み（初回デプロイ時）

## セキュリティ

- [ ] `.env` / シークレットをコミットしていない
- [ ] 管理APIに不要な公開がない

## デプロイ（人間承認必須）

- [ ] main へのマージ意思がある
- [ ] Render シークレット（RENDER_API_KEY, RENDER_SERVICE_ID）が設定済み
- [ ] 課金プラン（無料/有料）を確認した — **Render有料は月額発生**

## デプロイ後

- [ ] 本番URLで一覧・投稿・管理画面を目視確認
- [ ] エラーログを確認

## やってはいけないこと（AI・自動化）

- 人間の承認なしに `git push origin main`
- Render ダッシュボードでの課金プラン変更
- 本番DBの手動削除
