# personal-vault — Obsidian 向けパーソナルナレッジ

対話セッションで蓄積した「自分のこと」を Obsidian 互換 Markdown で保管するフォルダです。

## 使い方

1. Cursor で `@personal-knowledge` を呼び出し、対話する
2. エージェントがこのフォルダ内のノートを更新する
3. `git pull` でローカルに取得し、Obsidian で開く

## ローカルへの取り込み

### パターン A（推奨: サブフォルダ Vault）

1. ローカルでリポジトリを `git pull`
2. Obsidian → **Open folder as vault** → この `personal-vault/` フォルダを選択
3. 以降、pull のたびにノートが更新される

### パターン B（既存 Vault にマージ）

1. `personal-vault/*.md` を既存 Vault の `About-me/` 等にコピー
2. `sessions/` フォルダも一緒にコピー
3. wikilink（`[[価値観]]` 等）が壊れないよう、ファイル名を変更しない

## フォルダ構成

| パス | 内容 |
|------|------|
| `00-MOC-プロフィール.md` | 全体の目次（Map of Content） |
| `成り立ち.md` | 経歴・転機・バックグラウンド |
| `価値観.md` | 大切にしていること |
| `考え方.md` | 意思決定のパターン |
| `仕事の進め方.md` | ツール・自動化・委任の境界 |
| `目標とビジョン.md` | 短期・長期ゴール |
| `sessions/` | 対話ログ（生の Q&A） |
| `templates/` | ノート・セッションログのテンプレート |

## QA

```bash
node business-ops/scripts/knowledge-vault-qa.mjs
```

## 関連ドキュメント（リポジトリ内）

- 業務マップ: `business-ops/BUSINESS_MAP.md`
- エージェント活用: `business-ops/AI_AGENT_MASTERY.md`
