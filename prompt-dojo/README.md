# プロンプ道場

プロンプトを書いて、自動構造チェック・LLM評価・みんなの星評価でスキルアップする公開Webサービス。

## 機能

- 課題（お題）へのプロンプト投稿
- リアルタイム自動採点（構造チェック）
- LLM自動採点（OpenAI、投稿時）
- コミュニティの星評価・コメント
- 通報・モデレーション
- ユーザーによる課題投稿（承認制）
- Google OAuth ログイン
- ランキング・投稿履歴
- 管理画面
- 広告枠（AdSense）

## 開発

```bash
npm install
npm run dev
```

## 環境変数

| 変数 | 説明 | 必須 |
|------|------|------|
| `ADMIN_PASSWORD` | 管理画面パスワード | 推奨 |
| `AUTH_SECRET` | NextAuth シークレット | OAuth利用時 |
| `GOOGLE_CLIENT_ID` | Google OAuth | OAuth利用時 |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | OAuth利用時 |
| `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` | `true` でログインボタン表示 | OAuth利用時 |
| `OPENAI_API_KEY` | LLM採点 | 任意 |
| `LLM_DAILY_LIMIT` | LLM日次上限（デフォルト10） | 任意 |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | 広告 | 任意 |

## 本番デプロイ

Render Blueprint: [`render.yaml`](./render.yaml)

```bash
npm run build
npm run start:prod
```

## ドキュメント

- [REQUIREMENTS.md](./REQUIREMENTS.md)
