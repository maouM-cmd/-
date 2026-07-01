# プロンプ道場

プロンプトを書いて、自動構造チェック・LLM評価・みんなの星評価でスキルアップする公開Webサービス。

## 機能（Phase 9 まで）

- 課題へのプロンプト投稿・自動採点・LLM採点
- 星評価・コメント（返信スレッド）・通報
- ユーザー課題投稿（承認制）・AI課題生成
- 日本語 / 英語 UI（next-intl）+ **課題コンテンツ DB 多言語**（seed 英訳）
- Google / GitHub / Apple OAuth・メール会員登録
- Web Push + ネイティブ FCM（Capacitor）+ **購読解除 UI**
- オフライン書込キュー + Background Sync
- PWA（動的 manifest・オフライン対応）
- ランキング・履歴・管理画面・広告枠
- **GitHub Actions CI**（lint / test / build）

## 開発

```bash
npm install
npm run dev
```

## テスト・品質

```bash
npm run lint
npm test
npm run build
```

## 環境変数

`.env.example` をコピーして `.env.local` を作成してください。主要な変数:

| 変数 | 説明 |
|------|------|
| `ADMIN_PASSWORD` | 管理画面パスワード（本番では必ず変更） |
| `AUTH_SECRET` | NextAuth シークレット |
| `OPENAI_API_KEY` | LLM採点・課題生成 |
| `GITHUB_CLIENT_ID` / `SECRET` | GitHub OAuth |
| `VAPID_PUBLIC_KEY` / `PRIVATE_KEY` | Webプッシュ |
| `FIREBASE_*` | ネイティブ FCM（任意） |
| `APP_BASE_URL` | 本番 URL（プッシュ・ディープリンク） |

詳細は [REQUIREMENTS.md](./REQUIREMENTS.md) と [.env.example](./.env.example)

## 本番

```bash
npm run build && npm run start:prod
```

Render: [`render.yaml`](./render.yaml)

## モバイル（Capacitor）

[`mobile/README.md`](./mobile/README.md) を参照。WebView シェルは `mobile/` にあり、本番 URL を読み込みます。
