# bae-looks

NMIXX **ベイ**特化の「動画フレーム → 着用アイテム特定」フロントエンド試作（ブランド名: **BAE FRAME**）。

フロントの感触が良ければ、同じUI骨格でメンバー横断・他アーティストへ拡張する。

## セットアップ

```bash
cd bae-looks
npm install
npm run dev
```

http://localhost:3000 を開く。

## いまできること

1. ベイ特化ヒーロー
2. サンプルモーメント選択 → 特定アニメーション
3. 確証度つき候補カード（完全一致 / 同一ブランド / 類似）と代替案

データはすべてモック。実動画AI解析は未接続。

## ドキュメント

- [REQUIREMENTS.md](./REQUIREMENTS.md)
- [BASIC_DESIGN.md](./BASIC_DESIGN.md)
- [IMPLEMENTATION.md](./IMPLEMENTATION.md)
- ブリーフ: [`../business-ops/briefs/bae-looks-brief.md`](../business-ops/briefs/bae-looks-brief.md)

## ライセンス

Private
