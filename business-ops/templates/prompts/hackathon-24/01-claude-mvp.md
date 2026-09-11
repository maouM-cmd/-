# 01 Claude Code — MVP実装（丸貼り）

ワークスペース: `C:\Users\haruki\maou-workspace`  
先に `date-spark/REQUIREMENTS.md` と `BASIC_DESIGN.md` を読め。矛盾したら REQUIREMENTS の「捨てる」「受入条件」を優先。

```
# DATE SPARK 実装（確定稿）
質問するな。迷ったらこの稿の既定を選べ。コードを書け。
commit / push / 本番デプロイはするな。

## 一句
今夜の動詞は一つだけ。マンネリは店不足ではない。脚本を破る夜だ。

## 10秒で起きること（これを作れ。他は後回し）
1. http://localhost:3002 を開いた瞬間、動詞1語の大きなカードがある。kicker が見える。
2. チャット欄も Maps も店一覧も無い。
3. スロット1発（またはカードの「破る」）で証拠が載る。
4. 判定が巨大に出る。AI LIVE か AI FALLBACK のバッジ。
審査員が口にする言葉は「動詞カードを破る遊び」。

## 優先順位
残す: 即時カード + スロット3 + 破る + /api/verdict fallback-first + /api/health + lint/build
後回し: 写真、2人セッション、履歴UI、/theater /intro
捨てる: チャット、3プラン、Maps、店リスト、ログイン、マイク必須、optimal-match フォーク

## スタック
- 新規は date-spark/ だけ。coupon-board / optimal-match を編集するな
- Next.js 16。書く前に date-spark/node_modules/next/dist/docs/ を読め（無ければ create-next-app@16 のあと読め）
- TypeScript + Tailwind + App Router + src/
- DB: better-sqlite3。data/ は gitignore。初回 seed で動詞3つ
- Gemini: google-genai のみ。旧 google-generativeai は import するな
- PORT=3002。/api/health は {"status":"ok","service":"date-spark"}

create-next-app するとき README / REQUIREMENTS / BASIC_DESIGN / IMPLEMENTATION / AGENTS.md を消すな。

## ワンクリック seed
1. 歩かない — いつもの帰り道を使わない
2. 撮らない — 今夜は写真ゼロ
3. 席を変える — いつもの店でいい。席だけ変える

## AI判定
POST /api/verdict  body: { verb, evidence }
7秒で切れ。失敗は null。画面は先に fallback、後から差し替え。
返す JSON: { grade: S|A|B|C, line: 40字以内 }
店を提案するな。採点は「脚本を破ったか」だけ。
fallback:
- S: 破った。今夜の脚本はもう使えない。
- A: ずれている。もう一拍、壊せ。
- B: まだいつもの匂いがする。
- C: 脚本のままだ。カードをやり直せ。

## 骨格
kicker 常時: マンネリは店不足じゃない。脚本を破る夜だ。
#ai-badge（LIVE / FALLBACK）とミュートは任意。判定表示は巨大。
入力欄はスロット無しでも動くが、審査員はスロットだけで完走できること。

## 触る
date-spark/ 配下の新規実装ファイル、package.json、env.example、.github/workflows/date-spark-ci.yml（coupon-board-ci.yml をコピーして paths と working-directory だけ変える）

## 触るな
coupon-board/ optimal-match/ articles/ zenkoku-ai-hackathon 配下
business-ops/templates/prompts/hackathon-24/ （プロンプトは直すな）

## 完了
1. cd date-spark && npm run lint && npm run build が通る
2. PORT=3002 npm run dev → /api/health が ok
3. / でスロット1発 → 破る → 判定。キー入力なし
4. Gemini キー無しでも FALLBACK で完走
5. IMPLEMENTATION.md のステータスを「MVP実装済み」に更新
6. cursor へ Agent DM で結果（パス、見てほしい画面、未実施）

テスト: lint/build に加え、判定 API の fallback 経路を1本以上（キー無し or mock）で確認せよ。
pytest は使うな（このアプリは Node）。
```
