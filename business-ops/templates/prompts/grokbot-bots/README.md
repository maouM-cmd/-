# 検証済み Grok Bot（貼って作成）

検証日: 2026-08-27  
根拠: リポ横断調査 + Cursor 公式 + 既存フリートとの重複判定（追加 KEEP は 0）  
CW / note / `ai_company` 日次は対象外。

## アプリで今作る（3人）

Grok Bot アプリ → Create new agent → 各ファイルの **プロフィール** を description に貼る → **初回タスク** を1通。

| 順 | ファイル | 所有 |
|----|----------|------|
| 1 | `01-sanbo.md` | Web の WIP ダイジェスト。実装しない |
| 2 | `02-night-research.md` | CI / 仕様の翌朝ブリーフ。直さない |
| 3 | `03-repro-pack.md` | 再現手順とスクショ。コードは変えない |

グループは CI が赤いときだけ。キックオフ文は `../grokbot-fleet.md` §4。

## 4人目は作らない

重複判定の結論: KEEP 追加は 0。Render健康・Next16・秘密スキャン・下書き墓守は参謀または夜勤の Skill。Cursor / Claude / Bugbot と被るものは REJECT。

## 作らない（検証で落ちた）

| 候補 | 判定 | 代わり |
|------|------|--------|
| 秘密スキャン Bot | 作らない | 参謀がパスと種類だけ。本体は **Bugbot** |
| Cloud Environment Bot | 作らない | 草案は `business-ops/templates/cursor-environment.json.example`。作成・秘密情報・Build は [Cloud Agents ダッシュボード](https://cursor.com/dashboard/cloud-agents#environments) |
| best-of-n 書記 | 作らない | Cursor の `/best-of-n composer,gpt,grok` |
| Next16通訳 Bot | Grok Bot にしない | 夜勤が「Cursor で docs を読め」と渡す。通訳そのものは Cursor Grok 4.6 |
| Render健康 Bot | Bot にしない | 夜勤のブリーフに health 1行 |
| 下書き墓守 | Bot にしない | 参謀の週次（`grokbot-fleet.md` §7） |
| Design目撃 / dopagaki番人 / PORT門番 | 作らない | Design Mode / ブリーフが正 / `AGENTS.md` の PORT=3001 |

## 人間がダッシュボードでやること

- Bugbot を `maouM-cmd/-` で有効化（draft PR を見るなら Team の draft レビュー）
- Cloud Agent Environment を作り、secrets を入れ、Build を緑にする
- Render の再デプロイ・課金は触らせない
