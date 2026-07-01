# 競合調査: Cursor Agent Kit / AI Dashboard Starter

調査日: 2026-06-30

## Gumroad

| 商品 | 価格 | 内容 | 差別化ポイント |
|------|------|------|--------------|
| Ultimate NextJs SaaS Starter Kit | $100 | 汎用SaaS boilerplate | 認証・決済込み。AI業界データなし |
| SassyPack MERN/Next.js | $49+ | SaaSテンプレート | 汎用。ダッシュボードドメインなし |
| OpenAI Assistant Chatbot Skeleton | 未公開 | チャットボットコード | 単一用途。データパックなし |
| n8n x Flowise Agent Blueprint | 変動 | ワークフローJSON | 自動化向け。UI構築キットではない |
| Lexend SaaS Template | 変動 | ランディング+ダッシュボードUI | デザインテンプレ。シードデータなし |

**Gumroad上の「AI企業ダッシュボード構築キット」= 0件（近似商品なし）**

出典: [DEV - 3,000 Gumroad products](https://dev.to/merzouk_ayaden/i-analyzed-3000-ai-prompt-products-on-gumroad-heres-what-the-data-says-3obp)

## GitHub

| リポジトリ | Stars | 内容 | 本キットとの差 |
|-----------|-------|------|--------------|
| [Curling-AI/sbc-cursor-starter-kit](https://github.com/Curling-AI/sbc-cursor-starter-kit) | 少 | Cursor向け汎用boilerplate | ドメインデータなし |
| [AdibaAdi/ai-industry-dashboard](https://github.com/AdibaAdi/ai-industry-dashboard) | 少 | 完成済みフルスタックアプリ | キットではなく完成品。ML分類込み |
| [newsdatahub/ai-market-intelligence-dashboard](https://github.com/newsdatahub/ai-market-intelligence-dashboard) | 少 | ニュースAPI連携デモ | チュートリアル目的。Agent向け設計書なし |
| [qahtann/ai-powered-react-dashboard](https://github.com/qahtann/ai-powered-react-dashboard) | 少 | 汎用AI analytics UI | シードデータ・Agent context生成なし |

**GitHub上の「Agent向けAI企業データ + コンテキスト生成器」= ほぼ空白**

## Product Hunt

| カテゴリ | 状況 |
|---------|------|
| AI Dashboard builders | 完成SaaS製品は多数 |
| Developer starter kits for Cursor | 汎用boilerplateのみ |
| Agent context packs | **カテゴリ自体が未確立** |

ローンチ角度: **"Build an AI industry dashboard in one Cursor session"**

## 結論

| 比較軸 | 競合 | 本キット |
|--------|------|---------|
| 価格帯 | $49〜100（汎用SaaS） | $39（ニッチ特化） |
| ドメインデータ | なし | 10社+モデル+調達+ニュース |
| Agent向け設計書 | なし | REQUIREMENTS + COMPONENT_SPEC |
| コンテキスト自動生成 | なし | `generate-claude-context.mjs` |
| 無料版 | なし or 完成アプリデモ | 5社データ + 比較ツール |

**ポジション: 「汎用SaaS boilerplate」と「完成済みOSSダッシュボード」の間の空白地帯**
