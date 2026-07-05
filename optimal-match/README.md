# 最適人探し

相性スコアで、あなたに最適な人を見つけるマッチングアプリ MVP。

スワイプ型アプリとの差別化として、**説明可能な相性スコア**・**最適順ランキング**・**マッチ後チャット**を提供します。

## 主な機能

| 機能 | 説明 |
|------|------|
| 認証 | メール登録 / ログイン、Google OAuth（任意） |
| プロフィール | 写真・興味・目的・価値観・誠実さスライダー |
| 最適マッチ | 4軸スコア順ランキング + スタイルフィルター |
| いいね / マッチ | 相互いいねでマッチ成立 |
| チャット | マッチ相手との1対1メッセージ（SSEリアルタイム） |
| プッシュ通知 | マッチ・新着メッセージ（VAPID設定時） |

## セットアップ

```bash
cd optimal-match
cp env.example .env.local   # 任意（OAuth・プッシュ用）
npm install
npm run dev
```

http://localhost:3000

## 使い方

1. `/signup` でアカウント作成（または Google ログイン）
2. `/profile` でプロフィール・写真を設定
3. `/discover` で最適マッチを確認・いいね
4. 相互いいねで `/matches` にマッチ表示
5. `/chat` でメッセージ送信

## 本番デプロイ

Render Blueprint または Docker。詳細は [DEPLOY.md](./DEPLOY.md)。

```bash
npm run build && npm run start
```

## ドキュメント

- [REQUIREMENTS.md](./REQUIREMENTS.md) — 要件定義
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) — 画面・API一覧
- [DEPLOY.md](./DEPLOY.md) — 本番デプロイ手順
- [COMPETITIVE_ADVANTAGE.md](./COMPETITIVE_ADVANTAGE.md) — 競合優位性
