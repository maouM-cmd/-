# Agent DM プロトコル

Cursor と Claude Code に公式の相互DMはない。このリポジトリのスレッドファイルが会話口になる。

```
Cursor Cloud / IDE          Claude Code (Windows)
        \                      /
         \   git push/pull    /
          v                  v
     business-ops/agent-dm/threads/*.md
```

リアルタイムの吹き出しではない。片方が書いて push し、もう片方が pull して返す。人間は配達と最終承認。

## いつ使うか

| 使う | 使わない |
|------|----------|
| Cursor が調査・レビュー結果を渡し、Claude Code に実装させる | 同じ実装を両方に同時にやらせる |
| Claude Code が手元テスト結果を Cursor に返し、レビューさせる | 雑談、秘密情報、本番デプロイの依頼 |
| スマホの Cloud Agent が「続きは Claude で」と残す | ループしそうな往復（同じ質問の繰り返し） |

## 役割

| 参加者 | id | やること |
|--------|-----|----------|
| Cursor | `cursor` | 調査、差分レビュー、Design Mode、Cloud Agent からの依頼 |
| Claude Code | `claude-code` | 手元実装、テスト、日次 SOP からのエスカレーション |
| 人間 | `human` | 優先順位、merge、デプロイ、スレッドを閉じる |

## ループ防止（必須）

1. **最後に書いた側は返信しない。** CLI が拒否する。
2. **`waiting` が自分のときだけ動く。**
3. **エージェント往復は最大 8 ターン。** 超えたら `waiting: human`。人間が判断する。
4. **自分の仕事を相手に丸投げし直さない。** Cursor が実装を頼んだら、Claude は実装して結果を返す。Cursor はレビューする。役割を入れ替えない。
5. **main へは push しない。** スレッドファイルの commit/push は作業ブランチのみ。

## 配達

```bash
git pull --ff-only
node business-ops/scripts/agent-dm.mjs inbox --from cursor      # または claude-code
node business-ops/scripts/agent-dm.mjs show --id <id>
# 作業してから
node business-ops/scripts/agent-dm.mjs reply --id <id> --from cursor --body "..."
git add business-ops/agent-dm/threads/
git commit -m "chore(agent-dm): <id> cursor → claude-code"
git push
```

相手が別マシンなら、相手が `git pull` するまで届かない。人間が「Claude 側で inbox 見て」と言うか、同じブランチを両方で追跡する。

推奨ブランチ: 作業中の `cursor/*`。inbox 専用ブランチは作らない（散らばるため）。

## ステータス

| status | waiting | 意味 |
|--------|---------|------|
| `open` | `cursor` / `claude-code` | そのエージェントが次に動く |
| `open` | `human` | 判断待ち。エージェントは止まれ |
| `closed` | `human` | 終了 |
