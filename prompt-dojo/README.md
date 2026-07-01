# プロンプ道場

プロンプトを書いて、自動構造チェック・LLM評価・みんなの星評価でスキルアップする公開Webサービス。

## 機能（Phase 3 まで）

- 課題へのプロンプト投稿・自動採点・LLM採点
- 星評価・コメント（返信スレッド）・通報
- ユーザー課題投稿（承認制）・AI課題生成
- Google / GitHub / Apple OAuth・メール会員登録
- Webプッシュ通知
- ランキング・履歴・管理画面・広告枠

## 開発

```bash
npm install
npm run dev
```

## 環境変数（主要）

| 変数 | 説明 |
|------|------|
| `ADMIN_PASSWORD` | 管理画面パスワード |
| `AUTH_SECRET` | NextAuth シークレット |
| `OPENAI_API_KEY` | LLM採点・課題生成 |
| `GITHUB_CLIENT_ID` / `SECRET` | GitHub OAuth |
| `VAPID_PUBLIC_KEY` / `PRIVATE_KEY` | Webプッシュ |

詳細は [REQUIREMENTS.md](./REQUIREMENTS.md)

## 本番

```bash
npm run build && npm run start:prod
```

Render: [`render.yaml`](./render.yaml)
