# とどく

世帯の状況を聞くと、東京都の支援制度が順位付きで届くマッチングアプリ。

都知事杯オープンデータ・ハッカソン2026（テーマあり：生活 × デジタル）。

## セットアップ

```bash
cd todoku
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開く。

```bash
npm run test    # マッチング判定の単体テスト
npm run lint
npm run build   # 静的エクスポートは `out/`
```

## デモ手順

1. ペルソナ「ひとり親・4歳」を押す
2. 児童育成手当・ひとり親医療費が上位になることを確認
3. 「共働き・1歳」に切り替えると保育無償化・ベビーシッターが上がる
4. 「介護世帯」に切り替えると居宅介護・家族介護者支援が上がる

## ドキュメント

- [REQUIREMENTS.md](./REQUIREMENTS.md) — 要件定義（正）
- [BASIC_DESIGN.md](./BASIC_DESIGN.md) — 画面とデータ
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) — 機能→ファイル
- [SUBMIT.md](./SUBMIT.md) — 提出文案・2分台本

## 免責

適合判定はオープンデータの項目を簡易ルール化した**参考情報**です。申請可否・金額は各窓口の正式判定に従ってください。

## ライセンス

Private
