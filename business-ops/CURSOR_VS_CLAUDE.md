# Cursor だからこそできること

> 調査日: 2026-08-18
> 対象: GitHub `maouM-cmd/-`（本モノレポ）と `maouM-cmd/ai_company`（Claude Code 側）
> 結論だけ先に読むなら「役割分担」まで。設定作業は「人間がやること」へ。

## 結論

Claude Code が「実装・テスト・提出」で勝っているなら、Cursor を同じ用途で使う必要はない。存在意義は **編集中の補完（Tab）・裏で回す Cloud Agent・GitHub の自動レビュー（Bugbot）・イベント駆動（Automations）・Composer/Grok との使い分け** にある。

`ai_company` の `CLAUDE.md` にはすでにこう書いてある:

- 編集・差分確認 → Cursor
- 実装・テスト・提出 → Claude Code

この切り方だと Cursor は「きれいな差分ビューア」になり、存在意義はほぼ消える。一方、本モノレポの `.cursor/skills/` と `business-ops/` は **Cursor を指揮官** として設計されている。**頭の中の役割分担と、リポジトリの設計が食い違っている** のが「意義が感じられない」主因。

片方を捨てる話ではない。Claude Code は日次 SOP、Cursor は非同期・監査・マルチモデルのレイヤー。

## 役割分担（これだけ守る）

| 作業 | 使うもの | 理由 |
|------|----------|------|
| 手元の実装・テスト・提出 | **Claude Code** | ターミナル完結。`ai_company` の日次 Skill がここに最適化されている |
| 小さな修正・記事の穴埋め | **Cursor Tab / Cmd+K** | エージェントを起動しない日常の 8 割。Claude Code に無い |
| coupon-board の見た目修正 | **Cursor Design Mode** | 内蔵ブラウザで `localhost:3000` をクリックして直す |
| 電車・睡眠中の修正、スマホ起動 | **Cursor Cloud Agent** | すでにモバイルから起動済み。Environment を足すと実用になる |
| PR のセキュリティ／バグ監査 | **Cursor Bugbot** | 個人 GitHub 向けの製品レビュー。記事の「監査ゼロで炎上」対策 |
| CI 失敗 → 修正 PR | **Cursor Automations** | Claude Routines よりトリガーが広い |
| Next.js 16 など判断が割れる実装 | **Cursor `/best-of-n`** | Composer / GPT / Grok を並列比較。Claude 族だけではできない |
| 朝のチェック・今日の 1 時間・週報 | **Claude Code skills** | `ai_company` 側に既にある。移さない |
| 相手エージェントへ仕事を渡す | **Agent DM**（スレッドファイル） | 公式の相互DMはない。`@agent-dm` |

**やらない方がいい使い方:** Claude Code と同じ「手元で対話して実装」を Cursor Agent でもう一度やる。ここは重複なので意義は出ない。相手に渡すときは Agent DM を使い、両方で実装しない。

## 現状（GitHub と設定から）

### 2 つのサイロ

| リポジトリ | 役割 | あるもの | 無いもの |
|------------|------|----------|----------|
| [`maouM-cmd/-`](https://github.com/maouM-cmd/-) | Web 開発パイプライン | `.cursor/skills/` 5 本、autopilot、coupon-board / optimal-match | `.claude/`、Environment、Bugbot 設定 |
| [`maouM-cmd/ai_company`](https://github.com/maouM-cmd/ai_company) | 日次 OS（Windows） | グローバル `CLAUDE.md`、`.claude/skills/` 5 本 | `.cursor/` |

Cursor は `.claude/skills` も読むが、モノレポにはそれが無い。Claude Code は `.cursor/skills` を日次では読まない。スキルがリポジトリごとに分断されている。

### すでに触っているが、活きていない Cursor 機能

- **Cloud Agent をモバイルから起動済み**（coupon-board、AI ダッシュボード、ハッカソン準備）。
- Automation [Pull Request Approver](https://cursor.com/automations/952cce8a-6e19-11f1-a8a0-cafc5ef88358) が有効。同名エージェントが十数本走っており、**ノイズになっている**。
- 本リポジトリに **Environment（`.cursor/environment.json`）が無い**。Cloud Agent は毎回素の VM から立ち上がる。
- PR はほぼ `cursor/*` ブランチだが、**オープン draft が 10 本**（nomikai-ai、interview-cue、cosme-note など）。着手は速いが閉じない。
- Issue はゼロ。GitHub トリガーの Automation を繋ぐ先が無い。

### Claude Code 側の強み（移さない）

`ai_company` の skills は「今日の 1 時間」「朝のチェック」など **考える工程を消す SOP**。モノレポの Cursor skills は Web 開発パイプライン。用途が違う。

## 比較（2026-08 時点）

Cloud Agent・Plan・Skills・モバイル起動は両方にある。差別化は次の層。

| 能力 | Cursor | Claude Code | このワークスペースでの意味 |
|------|--------|-------------|---------------------------|
| Tab / Cmd+K | エディタ内補完・インライン編集 | 無し（エージェント先行） | coupon-board の小修正、記事 Markdown |
| 手元の対話実装 | あるが重複 | **主戦場** | 実装は Claude Code に任せる |
| Design Mode / 内蔵ブラウザ | `localhost` をクリックして直す | Chrome 拡張はログイン済み自分のブラウザ向き | coupon-board UI |
| Cloud Agent | 隔離 VM、成果物、デスクトップ接管 | claude.ai/code、GitHub 中心 | スマホから直す。Environment 未設定が弱点 |
| Automations | CI / ラベル / レビュー / Slack / スケジュール | Routines はスケジュールと PR/Release が中心 | 今の PR Approver はここに置き換える |
| PR レビュー | **Bugbot**（個人でも製品として載る） | マネージドは Team 向けで単価が高い | セキュリティ監査の穴を塞ぐ |
| モデル | Composer / Grok / GPT / Gemini / Claude | Claude 族のみ | 量は Composer/Grok、詰まりは Claude/GPT |
| `/best-of-n` | 複数モデルを worktree で比較 | 同族の並列セッションのみ | Next.js 16 の破壊的変更 |
| Skills | `.cursor/skills` + `.claude/skills` | `.claude/skills` | モノレポに両方ある。Agent DM は共通 |

## このときだけ Cursor（コピペ用）

### 1. Tab で小さな穴を埋める

エージェントを開かない。関数の続き、props のリネーム後の追随、記事の定型セクション。Claude Code では代替できない。

### 2. Design Mode で coupon-board の見た目

```
Agents Window のブラウザで localhost:3000 を開く
→ Design Mode
→ 直したい箇所をクリック or 囲む
→ 「このカードと同じ余白に」
```

### 3. スマホから Cloud Agent

[cursor.com/agents](https://cursor.com/agents) または iOS アプリ:

```
coupon-board の CI が赤い。失敗ログを読んで直して draft PR を出して。
@coupon-board-dev に従い、設計書と無関係なリファクタはしない。
```

Environment が無いあいだは、エージェントが `npm install` から始める。Builds を足すと「電車で直して帰宅前に PR」が現実になる。

### 4. `/best-of-n` で Next.js 16 を当てる

`coupon-board/AGENTS.md` が警告している破壊的変更向き。

```
/best-of-n composer,gpt,grok
coupon-board の params 非同期化を実装し、回帰テストを足して。
node_modules/next/dist/docs/ を読んでから API を使うこと。
```

勝った worktree だけ残す。

### 5. Bugbot を PR に載せる（人間がダッシュボードで有効化）

記事「Claude Codeと歩む4ヶ月」の失敗パターン（仕様を丸投げしてセキュリティ監査ゼロ）への直接対策。有効化後、レビュー方針は `.cursor/BUGBOT.md` に書く（この調査ではファイルは作らない）。

### 6. CI 失敗 Automation（PR Approver の代わり）

今の [Pull Request Approver](https://cursor.com/automations/952cce8a-6e19-11f1-a8a0-cafc5ef88358) は同名ランが連発している。止めるか条件を絞り、代わりに:

- GitHub: CI completed（失敗）→ 原因コメント or 修正 draft PR
- PR レビューコメント → 指摘の自動修正

ダッシュボード操作は人間のみ。

### 7. Cursor と Claude Code で会話する（Agent DM）

公式の相互DMは無い。スレッドファイルが会話口。

```
@agent-dm
Claude Code に「coupon-board の lint を直して。リファクタ禁止」と送って。
```

```bash
git pull --ff-only
node business-ops/scripts/agent-dm.mjs inbox --from cursor
node business-ops/scripts/agent-dm.mjs send --from cursor --to claude-code --title "..." --body "..."
```

プロトコル: `business-ops/agent-dm/PROTOCOL.md`。最後に書いた側は返信しない。実装は片方だけ。

## 足りないこと

設定・運用の穴。コードを増やせば埋まるものではない。

- ツール分担が文書化されていなかった（本ファイルで固定する）。
- `AI_AGENT_MASTERY.md` / SOP は Cursor 前提、`ai_company/CLAUDE.md` は Cursor = 差分。食い違い。
- `.cursor/rules` も `.cursor/BUGBOT.md` も Environment も無い。
- Autopilot L2 は「作って draft PR まで」。レビュー・マージ・捨てる判断が無い → draft の墓場。
- セキュリティの教訓が実装フロー（Bugbot / preflight）に繋がっていない。
- Issue がゼロなので、Issue → 実装の Automation を繋ぐ先が無い。
- Cursor と Claude Code の公式相互DMは無い（リポジトリ内 Agent DM で代替）。

## これから必要になること（L4 に行くなら）

目標は「brief 以外はエージェント、人間は承認のみ」。そのための次の層:

1. **役割固定** — 上の表を週次振り返りで確認する。Cursor Agent で手元実装を始めない。
2. **共通の短いルート `AGENTS.md`** — 両方に読ませるスタックと禁止事項。詳細 SOP は各ツールの skills に残す。
3. **Cloud Environment** — coupon-board の `npm install` を Build に載せ、エージェントがすぐ `next dev` できるようにする。`.cursor/environment.json` は別タスク。
4. **Bugbot + CI 失敗 Automation** — PR Approver は止めるか絞る。
5. **draft PR の仕分け** — 残す / 捨てる / Cloud Agent で 1 本仕上げる、を人間が決める。エージェントは実行だけ。

### 人間がやること（この文書ではやらない）

ダッシュボード・マージ・課金に触れる操作。エージェントは実行しない。

- [ ] [Pull Request Approver](https://cursor.com/automations/952cce8a-6e19-11f1-a8a0-cafc5ef88358) を無効化、または発火条件を絞る
- [ ] このリポジトリで Bugbot を有効化する
- [ ] Cloud Agent Environment を作り、coupon-board 用 Build を載せる
- [ ] オープン draft PR 10 本を「残す / 閉じる / 仕上げる」に仕分ける
- [ ] 必要ならルート `AGENTS.md` と `.cursor/BUGBOT.md` を次のタスクで追加する

## 関連

- プレイブック: `business-ops/AI_AGENT_MASTERY.md`
- SOP: `business-ops/SOP.md`
- Skill: `.cursor/skills/ai-agent-mastery/SKILL.md`
- Agent DM: `business-ops/agent-dm/PROTOCOL.md`
- 自動化候補（古い一覧）: `business-ops/AUTOMATION_CANDIDATES.md`
