# デートスパーク 基本設計

> 要件: [REQUIREMENTS.md](./REQUIREMENTS.md)

## アーキテクチャ

```
ブラウザ  /  → 動詞カード（静的シード + SQLite）
         ↓ 破る
         POST /api/break     証拠を保存
         POST /api/verdict   google-genai 判定（7s / fallback）
         GET  /api/health
```

- AI fetch は1関数に集約。AbortController 7秒。失敗は null。先に fallback 描画。
- SDK は **`google-genai` のみ**（旧 `google-generativeai` 禁止）。
- DB は `data/date-spark.db`（gitignore）。初回起動で動詞3枚を seed。

## 画面一覧

| パス | 説明 |
|------|------|
| `/` | 本体。開いた瞬間カード。スロット3。破る。判定。チャット無し |
| `/theater` | 解説用60秒シアター（本編を壊さない別ページ） |
| `/intro` | 紹介映像（REC webm） |

## データモデル

- `verbs(id, text, hint)` — seed 3行
- `breaks(id, verb_id, evidence_text, created_at)`
- `verdicts(id, break_id, grade, line, source)` — source は `live` / `fallback`

## ワンクリック例（seed）

1. **歩かない** — いつもの帰り道を使わない
2. **撮らない** — 今夜は写真ゼロ
3. **席を変える** — いつもの店でいい。席だけ変える

## AI判定プロンプトの種

役: 短い二人称の審判。店を提案するな。  
見るもの: 動詞と証拠1行。  
返す JSON: `{ "grade": "S"|"A"|"B"|"C", "line": "40字以内" }`  
S: 脚本を明確に破った / C: いつものまま

fallback:

- S: 「破った。今夜の脚本はもう使えない。」
- A: 「ずれている。もう一拍、壊せ。」
- B: 「まだいつもの匂いがする。」
- C: 「脚本のままだ。カードをやり直せ。」

## 触る / 触るな（実装時）

触る: `date-spark/` 配下の新規ファイル  
触るな: `coupon-board/` `optimal-match/` `zenkoku-ai-hackathon/` `detohimajikann`
