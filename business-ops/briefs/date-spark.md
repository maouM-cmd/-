# 新規Webプロジェクト ブリーフ — date-spark

## 基本情報

| 項目 | 記入 |
|------|------|
| プロジェクト名（slug） | date-spark |
| タイプ | nextjs |
| 一言説明 | 既存カップルのマンネリを、今夜の動詞1つで破る |

## 目的・ユーザー

- **誰のため:** 既に付き合っている二人（審査員のデスクトップ）
- **何を解決する:** 店不足ではなく「いつもの脚本」と「何する？」疲労
- **成功の定義:** 10秒で動詞カード。チャット無し。破る→判定までワンクリック完走

## MVP機能（3つまで）

1. 起動直後の動詞カード + スロット3
2. 「破った」証拠（テキスト1行。写真任意）
3. AI審判 `/api/verdict`（fallback 必須）

## 技術選定

| 項目 | 選択 |
|------|------|
| フレームワーク | Next.js 16 + TS + Tailwind |
| DB | better-sqlite3（`data/` gitignore） |
| ホスティング | ローカル + Cloudflare Tunnel。本番は人間 |
| 参考プロジェクト | coupon-board（構成のみ）。optimal-match はフォークしない |

## スコープ外

- チャット / 3プラン / Maps / 店リスト
- 出会いマッチング
- CrowdWorks / note

## 制約・注意

- 課金が発生するサービス: なし（Gemini キーはローカル `.env.local`）
- 認証が必要: いいえ
- PORT: 3002

正: `date-spark/REQUIREMENTS.md`  
貼る文: `business-ops/templates/prompts/hackathon-24/`
