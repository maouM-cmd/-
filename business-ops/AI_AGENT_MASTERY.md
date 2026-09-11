# 最強AIエージェントマスター プレイブック

## あなたの現在地

| 項目 | 状態 |
|------|------|
| 主業務 | Web開発 |
| ボトルネック | 新しい成果物のゼロイチ |
| くり返し | GitHub投稿 |
| ゴール | 最強AIエージェントマスター |
| レベル | **L3（autopilot 全自動投稿）** |

## ツール分担（Cursor vs Claude Code）

手元の実装は Claude Code。Cursor は Tab・Cloud Agent・Bugbot・Automations・モデル比較。**依頼が来たら `@agent-router` が先に分類する。** 同じ「対話実装」を二重にやらない。相手の会話・思考・画面を勝手に読む口は無い。Agent Mail デーモンは入れない。エージェント起動時は inbox を見る。

| 作業 | 使うもの |
|------|----------|
| 手元の実装・テスト・提出 | Claude Code |
| 小さな修正・記事の穴埋め | Cursor Tab / Cmd+K |
| UI の見た目修正 | Cursor Design Mode |
| スマホ・裏での修正 | Cursor Cloud Agent |
| PR 監査 / CI 失敗の自動修正 | Bugbot / Automations |
| Next.js 16 など判断が割れる実装 | Cursor `/best-of-n` |
| 朝のチェック・今日の1時間 | Claude Code skills（`ai_company`） |

詳細・調査根拠: `business-ops/CURSOR_VS_CLAUDE.md`

## マスターの定義

> **判断だけ人間。あとはエージェント。**

- 新規プロジェクト: 5分で骨組み → エージェントが肉付け
- GitHub投稿: preflight + 文案自動 → 人間が承認して push
- 週1: Skillを1つ改善 → 来週もっと任せられる

## 日次ルーティン（Web開発者版）

```
09:00  今日のタスクを1行で決める
09:05  新規なら project-brief → new-web-project.mjs
09:10  @web-dev-github で実装開始
       ↓
作業中  詰まったら @ai-agent-mastery の委任パターンを参照
       ↓
終了前  github-preflight → github-ship → チェックリスト → push
```

## 自動化で諦めた経験への対処

「ある」とのこと。よくある失敗パターンと対策:

| 諦めた理由 | 対策（今回の設計） |
|-----------|-------------------|
| 出力がブレる | Skill + テンプレで型固定 |
| 壊れた | preflight + 人間承認ゲート |
| 毎回説明が面倒 | ブリーフ入力フォーム |
| 投稿が怖い | draft PR + チェックリスト |

## Skill一覧（使い分け）

| 呼び出し | 用途 |
|----------|------|
| `@web-dev-github` | 新規開発・GitHub投稿 |
| `@coupon-board-dev` | 掲示板の修正 |
| `@article-production` | 記事（副業） |
| `@ai-agent-mastery` | 委任設計・振り返り |
| `@autopilot` | 全自動 ship（Cursor） |
| `@agent-router` | 実装前の分類（必須） |
| `@agent-dm` | 分類後の配達 |
| `CURSOR_VS_CLAUDE.md` | Cursor と Claude Code の分担 |
| `GROKBOT_FLEET.md` | Grok Bot（常時稼働）と Cursor 内 Grok 4.6 の分担 |
| `templates/prompts/grokbot-fleet.md` | 参謀 / 夜勤調査 / 再現パック / 司令塔のコピペ（CW・note は対象外） |

## スクリプト一覧

| コマンド | 用途 |
|----------|------|
| `new-web-project.mjs` | 新規プロジェクト骨組み |
| `github-preflight.sh` | 投稿前安全チェック |
| `github-ship.mjs` | コミット/PR文案生成 |
| `pre-deploy-check.sh` | 本番デプロイ前 |

## L3 → L4 への次のステップ

1. **今日:** `autopilot check` → `autopilot new` → `@autopilot` で1本通す
2. **今週:** 毎回 `ship --yes` をエージェント完了時に自動実行
3. **来週:** brief 以外は一切触らず PR まで完走を確認
4. **L4:** 実装も含め完全自律（brief のみ人間）。Cursor は非同期・監査、Claude Code は手元実装、という分担を崩さない

L4 で必要になる設定（Environment / Bugbot / draft PR 仕分け）は `CURSOR_VS_CLAUDE.md` の「人間がやること」。

## 委任の境界線（絶対に守る）

```
エージェント OK:  調査、コード、テスト、文案、設計書ドラフト
人間必須:        push、merge、デプロイ、課金、外部投稿、秘密情報
```

## 計測（任意）

週次振り返りで記録:
- エージェント任せ時間 vs 人間作業時間
- 新規成果物の着手〜PRまでの時間

目標: 4週間で着手時間を半分に
