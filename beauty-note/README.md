# コスメノート

化粧品販売店員向けの**商品・成分暗記アプリ**です。

> 全部覚えなくていい。今日の5商品だけ。

## こんな人向け

- 商品名・成分・色番を覚えるのが大変
- 仕事中はスマホが見れない（印刷シートで対応）
- 出勤前にサクッと復習、退勤後にメモしたい

## 3ステップの使い方

1. **出勤前10分** — 「暗記」タブでフラッシュカード復習
2. **印刷** — 「今日」画面から成分シートをPDF保存 or 印刷してポケットへ
3. **退勤後** — 「退勤メモ」でつまずいた成分や覚えたことを記録

## 機能

- 暗記モード（フラッシュカード + 成分クイズ）
- 今日の5商品ダイジェスト（ピン留め商品）
- 成分チートシート（印刷 / PDF）
- 商品ノート（成分・タグ・30秒トーク）
- 成分FAQ
- 退勤メモ
- PWA（ホーム画面に追加可能）

## セットアップ

```bash
cd beauty-note
npm install
npm run dev
```

http://localhost:3000 で開けます。

スマホ実機テスト（同一Wi-Fi）:

```bash
npm run dev -- -H 0.0.0.0
```

## ホーム画面に追加（PWA）

### iPhone（Safari）

1. アプリのURLをSafariで開く
2. 共有ボタン →「ホーム画面に追加」
3. 名前を確認して「追加」

### Android（Chrome）

1. アプリのURLをChromeで開く
2. メニュー（⋮）→「アプリをインストール」または「ホーム画面に追加」

## 彼女に URL で渡す

### Render で公開（おすすめ）

1. [Render Dashboard](https://dashboard.render.com) にログイン
2. **New** → **Blueprint**
3. この GitHub リポジトリを接続
4. Blueprint ファイル: **`render.beauty-note.free.yaml`**（無料・お試し）
   - データを残す本番は **`render.beauty-note.yaml`**（有料・月約$7〜）
5. **Deploy** を押す
6. 表示された URL（例: `https://cosme-note.onrender.com`）を彼女に送る

**渡す前に:** URL を開き **設定** で彼女の名前・応援メッセージを入れておく

**送るときの文例:**

> 仕事で商品覚えるの大変そうだから、使ってみて！
> ①出勤前に暗記 ②印刷してポケットに ③退勤後にメモ
> ホーム画面に追加するとアプリみたいに使えるよ

## 技術スタック

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- SQLite (better-sqlite3)
- PWA (manifest + Service Worker)

## デプロイ（Docker）

```bash
cd beauty-note
docker build -t beauty-note .
docker run -p 3000:3000 -v beauty-note-data:/app/data beauty-note
```

## データについて

- 初回起動時に化粧品サンプル25件 + 成分FAQが自動投入されます
- 実際の店の商品に差し替えて使ってください
- 設定画面からJSONエクスポートでバックアップできます
