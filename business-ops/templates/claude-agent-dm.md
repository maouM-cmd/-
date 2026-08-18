# ai_company / CLAUDE.md に追記する断片

Claude Code のホームが `ai_company` のとき、Cursor との会話はこのモノレポ側で行う。

````
## Agent DM（Cursor との会話）

先に分類（`.claude/skills/agent-router`）。製品の相互DMは無い。相手の会話・思考・画面は読めない。Agent Mail デーモンは入れない。

起動したら inbox を見る（Tab ではやらない）:

    git pull --ff-only
    node business-ops/scripts/agent-dm.mjs inbox --from claude-code
    gh issue list --label agent-dm --state open

`gh` 失敗は無視。`fetch_inbox` が見えるときだけ呼ぶ。無ければ入れない。

- 同じ PC: Cursor 仕事なら `agent -p`。Cursor から呼ばれる実装はそのままやる
- Cloud: このリポに cd → 上の inbox
- 「余白を直して」でプロジェクト名が無くても聞かない。既定は coupon-board の DealCard:

    agent -p "coupon-board の一覧カード（DealCard）の余白を他カードと揃えて。触ってよい: coupon-board/src/components/DealCard.tsx と一覧グリッド。完了条件: 同じ行のカードの高さと内部余白が揃う。リファクタ禁止。聞かないで進めて。"

ホーム直下では起動しない。`maouM-cmd/-` に cd してから分類する。
````
