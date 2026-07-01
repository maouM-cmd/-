# AI企業ダッシュボード開発キット

Claude で **AI企業ダッシュボード** を作るときの手助けツールです。

## 含まれるもの

| 内容 | 説明 |
|------|------|
| **シードデータ** | 10社・10モデル・7調達ラウンド・8ニュース |
| **型定義** | TypeScript スキーマ (`schemas/types.ts`) |
| **設計書** | 要件定義・コンポーネント仕様 |
| **コンテキスト生成** | Claude に渡す1ファイルを自動生成 |

## 使い方

### 1. コンテキストを生成

```bash
node ai-dashboard-kit/scripts/generate-claude-context.mjs
```

生成物:
- `output/CLAUDE_CONTEXT.md` — Claudeにそのまま貼れる統合ドキュメント
- `output/dashboard-data.json` — 全データのバンドル

### 2. Claude に渡す

**方法A**: `output/CLAUDE_CONTEXT.md` をプロジェクトに追加して Claude に読ませる

**方法B**: `CLAUDE.md` の指示テンプレートをコピーして会話に貼る

### 3. データを自分のプロジェクトにコピー

```bash
cp -r ai-dashboard-kit/data your-dashboard/src/data/
cp ai-dashboard-kit/schemas/types.ts your-dashboard/src/lib/types.ts
```

## ディレクトリ

```
ai-dashboard-kit/
├── CLAUDE.md              # Claude向け作業ガイド
├── README.md
├── data/
│   ├── companies.json     # AI企業マスタ
│   ├── models.json        # モデルリリース
│   ├── funding-rounds.json
│   └── news.json
├── schemas/
│   └── types.ts
├── docs/
│   ├── REQUIREMENTS.md
│   └── COMPONENT_SPEC.md
└── scripts/
    └── generate-claude-context.mjs
```

## 追跡企業（2024年末参考）

OpenAI, Anthropic, Google DeepMind, Meta AI, Mistral, Cohere, xAI, Perplexity, Stability AI, NVIDIA

## データ更新

`data/*.json` を編集 → スクリプト再実行 → Claude に新しい `CLAUDE_CONTEXT.md` を渡す

## ライセンス

このキットのデータ・ドキュメントは自由に利用・改変できます。数値は参考値であり、投資判断には使わないでください。
