# ハッカソン#24 制作基盤 — 貼る文

調査日: 2026-08-31  
WIP: AIハッカソン#24 デートマンネリ化解消アプリ  
正の要件: `date-spark/REQUIREMENTS.md`  
調査: 前回型 / 既存衝突 / 競合キル / 提出物型 の4本を先に走らせてから書いた。

## 結論（迷ったらこれ）

商品はチャットでも行程でもない。**画面に動詞が1つ出る。AIは審判だけ。**

| やること | 誰 | 貼るファイル |
|----------|----|----------------|
| MVP実装・テスト | Claude Code | `01-claude-mvp.md` |
| 開始10秒の監視 | Cursor | `02-cursor-watchdog.md` |
| 見た目 | Cursor Design Mode | `03-cursor-ui.md` |
| 解説シアター | Antigravity（コードは本編以外） | `04-slides-explain.md` |
| 自分用スライド + 3分台本 | Cursor または Antigravity | `05-slides-self.md` |
| 紹介映像 | Antigravity | `06-intro-video.md` |
| ピッチ台本だけ先に | 誰でも（実装待ち不要） | `07-pitch.md` |

## 貼る順

1. 人間が `REQUIREMENTS.md` を1回読む（別案ならそのファイルだけ差し替え）
2. Claude Code に `01` を丸貼り。質問させない
3. 上がったら Cursor で `02` → ブラウザで触る → 必要なら `03`
4. 本編が動いてから `04` `06`（本編ファイルは触るな）
5. `05` `07` は本編より先にやってよい

## 役割（2026-08-22 の失敗を繰り返さない）

- 同じファイルを二人で書かない。`触る` / `触るな` は各プロンプトに書いてある
- コンソール0エラー ≠ 動いている。ブラウザ必須
- Gemini は `google-genai`。失敗してもデモを止めない
- merge / 本番 / 課金は人間

## 作らない

Mano/CuoreFiore 型の行程チャット。optimal-match のフォーク。detohimajikann（行列待ちゲーム）の流用。Grok Bot 4人目。
