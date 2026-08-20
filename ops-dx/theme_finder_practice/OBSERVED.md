# theme_finder_practice 観測（2026-08-20）

アプリ ID: `bdf1292a-9224-4d82-9839-515a74a11820`  
モデル: `langgenius/ollama/ollama` / `hermes3:8b`  
知識検索: `INC-01.md` ハイブリッド  
公開: していない（観測のみ）

グラフ（Chatflow DAG）:

```
ユーザー入力 → LLM[クエリ書き換え] → 知識検索
  → CRITIC判定 → IF/ELSE (CRITIC.text 含む "incorrect")
       IF  → 回答 2 = 「該当する情報が見つかりませんでした。」
       ELSE → LLM 2[生成] → SELFRAG判定
            → IF/ELSE 2 (SELFRAG.text 含む "unfaithful")
                 IF  → LLM再生成 → 回答[再生成版]
                 ELSE → 回答 = LLM 2.text
```

## ライブ Preview

| ケース | 入力 | 期待 | 実際 |
|--------|------|------|------|
| A | 容量不足による障害 | critic `correct` → INC-01 の具体回答 | 検索 `[]`、critic `incorrect`、回答 2 |
| B | 有給の残日数を教えて | critic `incorrect`、回答 2 のみ | 検索 `[]`、critic `correct`、LLM 2 + SELFRAG まで実行。文言は断り文 |

ケース A の書き換え例: `容量不足による障害の症状 / 治療 / 予防 / 原因`（障害を疾患扱い）

## 直すなら（DSL が来てから）

1. クエリ書き換え: インシデント KB の語彙を保つ。医療クエリを禁止
2. CRITIC: 検索結果が空、または無関係なら必ず `incorrect` 一語
3. LLM 2: 空 context では生成せず断り文（ELSE に来る前に critic で落とすのが本筋）

DSL が `ops-dx/INBOX/dsl/` に無いので、ここではグラフを書き換えない。
