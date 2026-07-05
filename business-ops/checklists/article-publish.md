# 記事公開前チェックリスト

公開・`published: true` 変更前に人手で確認してください。

## 機械チェック（必須）

```bash
node business-ops/scripts/article-qa.mjs articles/対象ファイル.md
```

- [ ] エラー 0 件

## 内容

- [ ] タイトルと本文の見出しが一致している
- [ ] 3つのポイントが重複していない
- [ ] 実践例に検証不能な断定がない
- [ ] プレースホルダー（TODO、括弧指示）が残っていない
- [ ] 誤字・変な日本語がない

## リンク・CTA

- [ ] Gumroad URL が正しい（https://springharu.gumroad.com/l/yariyy）
- [ ] Note 有料記事リンクの意図が正しい
- [ ] 外部リンクが切れていない

## 公開判断（人間のみ）

- [ ] 公開タイミングを確認した
- [ ] `published: true` に変更する意思がある
- [ ] Note / SNS への実投稿は**別操作**で行う（このチェックでは投稿しない）

## 公開後

- [ ] Note にコピーした本文を目視確認
- [ ] サムネ・タグを設定
- [ ] 公開URLを記録（任意: content-calendar）
