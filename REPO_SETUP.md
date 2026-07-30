# 新しい GitHub リポジトリの作成手順

`coupon-board` という名前の専用リポジトリに移行する手順です。

## 方法 A: スクリプト（推奨）

```bash
bash scripts/create-github-repo.sh
```

GitHub CLI (`gh`) にログイン済みで、リポジトリ作成権限がある場合は自動で完了します。

## 方法 B: GitHub ウェブ UI

1. https://github.com/new を開く
2. Repository name: `coupon-board`
3. Description: `招待・紹介キャンペーンをみんなで共有する掲示板サイト`
4. **Create repository**（README 等は追加しない・空のまま）
5. ローカルでリモートを切り替えてプッシュ:

```bash
git remote set-url origin https://github.com/maouM-cmd/coupon-board.git
git push -u origin main
```

## 方法 C: GitHub CLI を手動実行

```bash
gh repo create maouM-cmd/coupon-board \
  --public \
  --description "招待・紹介キャンペーンをみんなで共有する掲示板サイト（Next.js + SQLite）"

git remote set-url origin https://github.com/maouM-cmd/coupon-board.git
git push -u origin main
```

## 移行後の確認

- Render を使う場合: Blueprint で新リポジトリ `maouM-cmd/coupon-board` を接続
- GitHub Actions の Secrets は新リポジトリにも再設定が必要です
