# プロンプ道場

プロンプトを書いて、自動構造チェックとみんなの星評価でスキルアップする公開Webサービス。

## 機能

- 課題（お題）に対するプロンプト投稿
- リアルタイム自動採点（構造チェック）
- コミュニティの星評価（1〜5）
- ランキング・投稿履歴
- 管理画面（課題 CRUD）

## 開発

```bash
npm install
npm run dev
```

http://localhost:3000 で起動。

## 環境変数

| 変数 | 説明 | デフォルト |
|------|------|-----------|
| `ADMIN_PASSWORD` | 管理画面パスワード | `prompt-dojo-admin` |
| `NEXT_PUBLIC_SITE_NAME` | サイト名 | `プロンプ道場` |

## 本番デプロイ

Render Blueprint: [`render.yaml`](./render.yaml)

```bash
npm run build
npm run start:prod
```

## ドキュメント

- [REQUIREMENTS.md](./REQUIREMENTS.md)
