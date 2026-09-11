# Grok Bot × 複数エージェント運用

> 調査日: 2026-08-27
> 対象: [Grok Bot](https://x.ai/news/introducing-grok-bot)（2026-08-26 から Cursor Pro 込み）と [Cursor 内 Grok 4.6](https://cursor.com/blog/grok-4-6)
> 結論だけ読むなら「役割地図」と「最小3人」まで。貼る文は `templates/prompts/grokbot-fleet.md`。
> **境界（2026-08-27）:** CrowdWorks / note / `ai_company` の日次 SOP は触れない。Claude Code 側のまま。この層は Web モノレポ（coupon-board / optimal-match / GitHub）だけ。

## 結論

Grok Bot は Cursor の代わりではない。**PC を閉じても続く Web 側の準備**の層。手元の実装は今までどおり Claude Code。Cursor 内の Grok 4.6 は、長い調査・UI の一発目・複数モデル比較の層。

CrowdWorks・note・今日の1時間は `ai_company` の Claude Code skills。Grok Bot に移さない。下書きも調査もしない。

三つを同じ「対話してコードを書く」用途で回すと、既存の `@agent-router` が壊れる。

## いま使えるもの（混同しない）

| 名前 | 何か | いつ使う |
|------|------|----------|
| **Grok Bot** | xAI の常時稼働アプリ。名前付き Bot、クラウド PC、グループチャット。Cursor の使用量とは別枠 | Web の夜勤調査、CI 再現パック、draft PR 仕分け、日次ダイジェスト。Windows のコードは触らせない |
| **Cursor の Grok 4.6** | IDE 内モデル。長時間のツール使用・自己検証・視覚/対話 UI の初稿が強い | リポ内の長い仕事、`/best-of-n` の一票、Task サブエージェントの司令 |
| **Claude Code** | 手元実装・テスト・日次 SOP | lint、API、今日の1時間、CrowdWorks、note |
| **Codex / Composer / GPT** | Cursor 内の別モデル | `/best-of-n` の対抗馬。単体の日常実装にはしない |

公式の要点（Grok Bot）:

- Bot は最大 50（グループ含む）。グループは 2〜6 人
- 仕事は **繰り返し成果を持つ役割** に付ける。「何でも屋」は作らない
- 会話はタスク、**プロフィール説明は常設ルール**
- 外部送信・公開・課金・本番変更は承認の後ろ
- Skill（やり方）→ 二回目で安定 → Routine（いつ回すか）。いきなり定期実行しない
- クラウド PC は自宅 Windows とは別。ローカル操作は別許可

公式の要点（Grok 4.6）:

- 長いエージェント仕事向け。ツールを使い、結果を見て方針を変える
- 漠然としたプロダクト案を動く初版まで持っていくのが強い
- 視覚・インタラクティブの一発目が 4.5 より厚い
- effort: xhigh / high（既定）/ medium / low

## 役割地図（このワークスペース）

既存の正は `CURSOR_VS_CLAUDE.md`。Grok 層を足すとこうなる。

| 作業 | 使うもの | やらないもの |
|------|----------|----------------|
| 今日の WIP を1本に保つ | Grok Bot **参謀**（読み取り・仕分け） | 参謀が実装を始めない |
| 夜・電車・PC オフの Web 調査と再現 | Grok Bot 専門 Bot | Cursor Agent の二重起動 |
| coupon-board の見た目 | Cursor Design Mode | Grok Bot に CSS を書かせない |
| Next.js 16 など判断が割れる実装 | Cursor `/best-of-n composer,gpt,grok` | 同族モデルだけの並列 |
| 手元の実装・テスト | Claude Code | Grok Bot のクラウド PC で `npm` |
| 朝チェック・今日の1時間・CW・note | Claude Code skills（`ai_company`） | Grok Bot に寄せない。読むな |
| PR 監査 | Bugbot | Grok Bot に merge させない |
| 相手へ仕事を渡す | `@agent-router` → Agent DM / `agent -p` | Grok Bot グループを「第二のルーター」にしない |

**やらない方がいい使い方:** Grok Bot に coupon-board を実装させる。Claude Code と同じ対話実装をもう一本増やす。Bot を 10 個作って自分が中継になる。CrowdWorks / note / `articles/` を Grok Bot にやらせる。

## 最小3人（これ以上は作らない）

公式も「最小の有用な編成から」としている。この家の Web 層では3つで足りる。

| Bot | 所有する成果 | 承認の線 |
|-----|--------------|----------|
| **参謀** | ソース付きダイジェストと「次の1手」。WIP=1 の番人 | 送信・予定変更・WIP 上書き禁止。CW/note に触れない |
| **夜勤調査** | 翌朝使える Web ブリーフ（CI / Next.js / 仕様） | コード変更禁止。CW/note 禁止 |
| **再現パック** | coupon-board / optimal-match の再現手順とスクショ | 実装しない。本番顧客データ禁止 |

4つ目を足してよい条件: 同じ Web 成果が週3回以上出て、参謀が毎回中継で詰まるときだけ。検証済みの作成物は `templates/prompts/grokbot-bots/`。

## 検証結果（2026-08-27・複数エージェント）

リポ上の繰り返し業務（CI / Render / preflight / Next 16 docs / draft PR）と、Cursor 公式（Cloud Environment はダッシュボード必須、Bugbot は製品、`/best-of-n` は IDE の UI、Grok Bot は別製品）を突き合わせた。

| 候補 | 判定 |
|------|------|
| 参謀 / 夜勤調査 / 再現パック | **作る。** `templates/prompts/grokbot-bots/01`〜`03` |
| 追加の4人目 | **作らない（KEEP 0）。** 同じ「読んで1枚出す」を増やさない |
| Render健康 | **FOLD → 夜勤。** health の1行。専用 Bot にしない |
| 秘密スキャン Bot | **FOLD → 参謀**（パスと種類だけ）+ **Bugbot を有効化** |
| Cloud Environment Bot | **REJECT。** 草案だけ `templates/cursor-environment.json.example` |
| best-of-n 書記 | **REJECT。** `/best-of-n composer,gpt,grok` |
| Next16通訳を Grok Bot にする | **FOLD → 夜勤が Cursor へ渡す。** docs は Windows の `node_modules` |
| 下書き墓守 | **FOLD → 参謀** の週次 |

**人間がダッシュボードでやること:** Bugbot 有効化、Cloud Agent Environment の作成と緑の Build。Grok Bot を増やしても VM は素のまま。

## 作らない（既存か、別サイロ）

`CURSOR_VS_CLAUDE.md` の穴の扱いも検証結果の表に従う。週3回同じ成果が出るまで Bot を増やさない。

| 作りたくなるもの | 理由 |
|------------------|------|
| 実装 Bot / パッチ Bot | Claude Code の仕事 |
| UI を直す Bot | Cursor Design Mode |
| CrowdWorks / note / 今日の1時間 | `ai_company`。触れない |
| Pokemon / WEBAPI 係 | セッション分離。このモノレポの Grok Bot に載せない |
| Hermes / OpenClaw の代わり | ハートビートは向こう |
| 何でも屋 | 公式も禁止。文脈が再利用できない |
| PR Approver の代わりに approve する Bot | 今の Automation がノイズ。Bot で増やさない |

## 独自案（公式の延長でこの家向け）

### 1. WIP=1 参謀（最優先）

Grok Bot 公式の Chief of Staff は「昨日何が動いたか」のダイジェスト係。ここでは **新しい仕事を始めない係** にする。アイデアが来たら `queue.md` のパークへ回す文だけ返す。実装エージェント（Claude / Cursor / 自分）の代わりに着手しない。CW / note の項目はダイジェストに載せない（`ai_company` 側）。

これが無いと、常時稼働 Bot が WIP=1 を壊す。

### 2. 三層ループ（夜→朝→実装）— Web だけ

```
夜  Grok Bot 夜勤調査  … PC オフでも CI / 仕様ブリーフを積む
朝  参謀ダイジェスト   … 人間が WIP を1行決める（Web 件だけ）
昼  Cursor Grok 4.6    … 構造・UI初稿・/best-of-n
    Claude Code        … 手元実装とテスト
晩  人間               … push / デプロイだけ
```

同じ成果を二層で同時に作らない。夜勤が「下書き」、昼が「本体」。CrowdWorks / note はこのループに入れない。

### 3. CI 再現グループ（最大3人・段階オーナー）

公式のグループキックオフを、coupon-board / optimal-match の赤い CI に接続する。

- 夜勤調査が失敗ログと当たり範囲
- 再現パックが手順・スクショ・期待と実際
- 参謀が「Claude に渡す1通」を出す。実装はしない

Grok Bot にリポを clone して直させるのは禁止（クラウド PC ≠ この Windows）。

### 4. 再現パック → Agent DM（実装しない）

公式の Bug Reproduction を、この家の配達に接続する。

- Grok Bot が staging / localhost で再現し、手順・スクショ・期待と実際をパックにする
- パックを `business-ops/briefs/` に置くか、参謀が「Claude に渡す文」を出す
- 実装は Claude Code。Cursor はレビューか Design Mode

### 5. 下書き墓守（週1 Routine）

`CURSOR_VS_CLAUDE.md` の未処理: オープン draft PR が溜まる。参謀の週次 Routine で「残す / 閉じる / Cloud Agent で仕上げる」の3分類表だけ出す。人間が決める。Bot は close も merge もしない。

### 6. 反転コーチ（任意・Web 訓練だけ）

AUTO 実装の逆。coupon-board / optimal-match の「手 / 地図 / 説明」。答えを先に出さない。今日の1時間の B ブロックや `ai_company` の学習 SOP は移さない。

### 7. モデル陪審（Cursor 内）

判断が割れる実装だけ:

```
/best-of-n composer,gpt,grok
```

勝った worktree だけ残す。Grok 4.6 は「量と初稿」側、GPT は「詰まり」、Composer は「速さ」。日常の小さな修正に陪審を使わない。

### 8. 睡眠ハンドオフ（定型1通）

寝る前に参謀へ1通。朝に **Web 側だけ** のダイジェストが返る。CW / note は書かせない。新しい WIP は作らせない。プロンプト本文はテンプレ側。

## セットアップ順（いきなり Routine しない）

1. Grok Bot アプリを入れる（Cursor Pro に含まれる。使用量は Cursor と別枠）
2. 参謀だけ作る。プロフィールに常設ルールを貼る（CW/note 禁止を含む）
3. 安全な1タスク（Web ダイジェスト、送信なし）を一回やる
4. 直してから Skill 化
5. 夜勤調査・再現パックを足す。グループは CI 再現のときだけ
6. 平日朝の Routine はダイジェストが2回安定してから
7. Cursor 側はモデルを Grok 4.6 にして長い1件を試し、`/best-of-n` は Next.js 16 のときだけ

## 関連

- コピペ: `business-ops/templates/prompts/grokbot-fleet.md`
- 分担の正: `business-ops/CURSOR_VS_CLAUDE.md`
- 分類: `.cursor/skills/agent-router/SKILL.md`
- 配達: `business-ops/agent-dm/PROTOCOL.md`
- 公式: [Grok Bot bots](https://docs.x.ai/grok-bot/bots) / [chat](https://docs.x.ai/grok-bot/chat-and-collaboration) / [skills](https://docs.x.ai/grok-bot/skills-routines-and-automations) / [Grok 4.6](https://cursor.com/docs/models/grok-4-6)
