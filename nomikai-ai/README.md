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

## 主な機能

1. イベント作成 & 共有リンク発行
2. 参加者の予定・最寄駅入力
3. 中間地点・店候補・盛り上げプラン自動生成
4. OpenAI / Anthropic / Google Places / 地図 / 幹事プッシュ通知
5. **PWA** — スマホのホーム画面に追加可能

## 本番デプロイ

[DEPLOY.md](./DEPLOY.md) を参照。Render Blueprint で `render.yaml` をデプロイ。

## 環境変数（オプション）

```bash
cp env.example .env.local
```

| 変数 | 用途 |
|------|------|
| `APP_URL` | 本番公開 URL（プッシュ通知） |
| `OPENAI_API_KEY` | AI 盛り上げ（OpenAI） |
| `ANTHROPIC_API_KEY` | AI 盛り上げ（Claude） |
| `GOOGLE_MAPS_API_KEY` | Places 店舗検索 |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | 地図 Embed 表示 |
| `VAPID_*` | 幹事向けプッシュ通知 |

未設定の場合はテンプレートベースで動作します。

## ライセンス

Private
