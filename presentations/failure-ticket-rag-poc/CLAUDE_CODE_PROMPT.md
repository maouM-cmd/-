# Claude Code 用プロンプト — 障害票RAG PoC スライド

以下をそのまま Claude Code に貼り付けてください。

---

```
あなたは資料作成担当です。既存の障害票RAG PoC発表資料を、ローカルで確認・改善してください。

## 対象パス
presentations/failure-ticket-rag-poc/

## 現状の成果物
- 障害票RAG_PoC発表資料.pptx … 16枚のPowerPoint
- preview.html … ブラウザ確認用
- build_slides.py … python-pptx 再生成スクリプト
- README.md … 再生成手順

## 発表のテーマ
障害票を活用した運用改善テーマ発見AIのPoC検証。
Dify上で障害票をナレッジ化し、類似障害検索 / 障害情報抽出 / 改善テーマ生成を行う。

## ストーリー方針（必須）
単なるシステム紹介にしない。各段階を必ず次の流れで語る。
発生した課題 → 原因分析 → 改善 → 結果

技術進化の軸:
Basic RAG → Query Rewrite RAG → Critic RAG → Self-RAG

## スライド構成（16枚・タイトル変更禁止）
1. タイトル
2. 背景・目的
3. システム全体構成
4. Basic RAG
5. Basic RAGで発生した課題
6. Query Rewrite RAG
7. Query Rewriteによる改善結果
8. Critic RAG
9. Critic改善
10. Self-RAG
11. Self-RAG改善
12. 試行錯誤の変遷
13. 評価結果
14. PoCで得られた知見
15. 今後の展望
16. まとめ

## コンテンツ根拠（要約）
- Basic RAG: 入力→ナレッジ検索→障害情報抽出→改善テーマ生成
  - 抽出: 障害名/原因/対応/恒久対策
  - 生成: 改善テーマ/改善内容/期待効果
  - 課題: 表現ゆれに弱い。学び「回答品質は検索品質に依存」
- Query Rewrite: 表現ゆれ対策。失敗は変換しすぎ（DBトラブル→運用改善課題）
  - 改善制約: 原文維持・説明しない・言い換えすぎない・JSONのみ
- Critic: 改善テーマ品質評価（関連性/再発防止効果/実現可能性）
  - 課題: ユーザー質問を評価対象に含めていなかった
- Self-RAG: 検索要否・根拠十分性の自己判定と再検索ループ
  - ※詳細は元プロンプトが薄いため仮定明示で補完済み

## やってほしいこと
1. preview.html をローカルで開いて内容を確認する
   - 例: `cd presentations/failure-ticket-rag-poc && python3 -m http.server 8765`
   - ブラウザで http://127.0.0.1:8765/preview.html
2. 体裁・文言・論理の穴を直し、必要なら build_slides.py を更新して再生成する
3. 再生成後に枚数=16・タイトル一致を検証する（スクリプト内 VERIFY を通す）
4. 変更があれば commit まで行う（main push / force push は禁止）

## デザイン方針
- ビジネス向けシンプル（白背景・濃紺アクセント）
- 1スライド1メッセージ
- 箇条書き中心、フローは矢印で表現
- 評価結果の定量値は「例示」ラベルを維持

## 完了条件
- [ ] preview.html をローカルで開ける
- [ ] .pptx が16枚・構成タイトルどおり
- [ ] 課題→原因→改善→結果の流れが崩れていない
- [ ] build_slides.py から再生成できる
```
