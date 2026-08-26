# 障害票RAG PoC 発表資料

障害票を活用した運用改善テーマ発見AIのPoC検証向け、16枚構成の発表スライドです。

## 成果物

| ファイル | 説明 |
|---|---|
| `障害票RAG_PoC発表資料.pptx` | PowerPoint 本体 |
| `preview.html` | ブラウザ確認用プレビュー |
| `build_slides.py` | 再生成スクリプト |

## 再生成手順

```bash
pip install python-pptx
python3 build_slides.py
```

実行すると `.pptx` と `preview.html` を上書き生成し、スライド枚数（16）とタイトル一覧の一致を検証します。

## スライド構成

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

## ストーリー方針

各RAG段階を「発生した課題 → 原因分析 → 改善 → 結果」で語ります。
