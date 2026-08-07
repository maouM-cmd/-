# 飲み会盛り上げAI

幹事がリンクを共有するだけで、みんなの予定・中間地点・店・盛り上げプランがスマホで見られる Web アプリ。

## セットアップ

```bash
cd nomikai-ai
npm install
npm run dev
```

http://localhost:3000 で起動します。

## ドキュメント

- [REQUIREMENTS.md](./REQUIREMENTS.md) — 要件定義
- [BASIC_DESIGN.md](./BASIC_DESIGN.md) — 基本設計
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) — 実装対応表
- [RENDER_SETUP.md](./RENDER_SETUP.md) — Render 初回セットアップ

## 主な機能

1. イベント作成 & 共有リンク発行
2. 参加者の予定・最寄駅入力
3. 中間地点・店候補・盛り上げプラン自動生成
4. OpenAI / Anthropic / Google Places / 地図 / プッシュ通知
5. **幹事アカウント** — メール、Google / LINE / Apple ログイン
6. **参加者編集** — 編集用リンク / プラン確定プッシュ
7. **多言語** — 日本語 / 英語（`?lang=en` または言語切替）
8. **PWA** — スマホのホーム画面に追加可能 / OGP 対応

## 本番デプロイ

[DEPLOY.md](./DEPLOY.md) を参照。Render Blueprint で `render.yaml` をデプロイ。

## 環境変数（オプション）

```bash
cp env.example .env.local
```

| 変数 | 用途 |
|------|------|
| `APP_URL` | 本番公開 URL（プッシュ通知・OAuth リダイレクト） |
| `OPENAI_API_KEY` | AI 盛り上げ（OpenAI） |
| `ANTHROPIC_API_KEY` | AI 盛り上げ（Claude） |
| `GOOGLE_MAPS_API_KEY` | Places 店舗検索 |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | 地図 Embed 表示 |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `LINE_CHANNEL_ID` / `LINE_CHANNEL_SECRET` | LINE Login |
| `APPLE_CLIENT_ID` / `APPLE_TEAM_ID` / `APPLE_KEY_ID` / `APPLE_PRIVATE_KEY` | Apple Sign In |
| `VAPID_*` | 幹事・参加者プッシュ通知 |

未設定の場合はテンプレートベースで動作します（OAuth / プッシュは無効）。

## ライセンス

Private
