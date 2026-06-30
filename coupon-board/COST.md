# 費用ガイド

**結論: 趣味で使うなら 0 円で十分。公開も無料〜月数百円の選択肢がある。**

---

## ざっくり比較

| 方式 | 月額目安 | データ保存 | おすすめ度 |
|------|----------|-----------|-----------|
| **ローカルだけ**（`npm run dev`） | **0円** | 自分のPC | 趣味・開発 ◎ |
| **自宅PC + Cloudflare Tunnel** | **0円** | 自分のPC | 無料公開 ○ |
| **Oracle Cloud 無料VM** | **0円** | VM内 | 無料公開 ◎ |
| **最安VPS**（ConoHa等） | **約600〜1,500円** | サーバー | 本格運用 ◎ |
| **Render 無料枠** | **0円** | ⚠️ ほぼ保存されない | お試しのみ △ |
| **Render 有料**（Starter + ディスク） | **約$8〜10（1,200〜1,500円）** | クラウド | 手軽だが有料 △ |

---

## Render について（今の設定）

`render.yaml` は **Starter + 永続ディスク** 想定 → **月約 1,200〜1,500円** かかります。

| 項目 | 料金 |
|------|------|
| Starter（Web） | $7/月 |
| 永続ディスク 1GB | 約 $0.25/月 |
| 合計 | おおよそ **$7〜10/月** |

Render **無料枠**はあるが、このサイトには向かない:

- 15分アクセスなしで **スリープ**（起動に30〜60秒）
- **永続ディスクが使えない** → SQLite・画像が消える
- 趣味掲示板の本番運用には不向き

→ **お金をかけたくないなら Render は使わない方がよい**

---

## 0円でやる方法

### A. ローカルだけ（いちばん簡単）

```bash
cd coupon-board
npm install
npm run dev
```

自分のPCで http://localhost:3000 → **完全無料**

### B. 自宅PCを公開（Cloudflare Tunnel・無料）

1. PCで `npm run dev` または Docker 起動
2. [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) で無料公開
3. ドメインも Cloudflare 経由なら追加料金なし

※ PCをつけっぱなしにする必要あり

### C. Oracle Cloud 無料枠（Always Free）

- ARM VM が **永久無料**
- Docker Compose でそのまま動かせる
- 手順はやや多いが **0円で24時間公開** できる

---

## 月数百円でやる方法（おすすめ）

### 最安VPS + Docker

| サービス | 目安 |
|---------|------|
| ConoHa VPS 最小 | 約 900円/月 |
| Vultr 最小 | 約 $5〜6/月 |
| さくらのVPS 最小 | 約 900円/月 |

```bash
# VPS上で
git clone <repo>
cd coupon-board
cp .env.example .env.local
docker compose up -d --build
```

SQLite も画像もそのまま使える。**Render より安いことも多い。**

---

## 設定ファイルの使い分け

| ファイル | 用途 |
|---------|------|
| `render.yaml` | Render **有料**（Starter + ディスク）※月額かかる |
| `render.free.yaml` | Render **無料お試し**（データ消える・スリープあり） |

---

## 広告収入について

AdSense を入れても、最初はアクセスが少なく **広告収入 < サーバー代** になることがほとんど。  
趣味プロジェクトなら **まず 0 円構成** が現実的。
