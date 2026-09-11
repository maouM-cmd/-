# maou-workspace (マルチAIエージェント統合ワークスペース & プレイブック)

> **Antigravity, Cursor, Claude Code, Codex, Grok Bot を統合運用するためのスキル体系・業務自動化テンプレート・企画書アーカイブ**

---

## 📖 概要

本リポジトリは、開発者が日常的に利用する複数のAIエージェントの能力を最大限に引き出すための統合ナレッジ・スキルリポジトリです。
各エージェントの得意分野に応じた役割分担（Router）、協調プロンプト、企画書の標準WBSテンプレート、および自律運用のための実行スクリプト群を管理しています。

---

## ✨ 主な構成

### 1. マルチエージェント・スキル体系 (.agents/skills/, .cursor/skills/, .claude/skills/)
- **gent-dm**: Antigravity, Cursor, Claude Code, Codex 間の共通メッセージング・メモリー共有
- **gent-router**: ユーザーの指示内容（調査・実装・レビュー・資料化）に応じて最適なエージェントへタスクをルーティング
- **learning-coach**: デイリー学習・日次タスク・スキル定着の伴走支援
- **utopilot**: 反復作業の完全自律実行
- **rticle-production**: 技術記事・note・ブログの企画・執筆・校正パイプライン

### 2. ビジネス運用 & 企画プレイブック (usiness-ops/)
- **CURSOR_VS_CLAUDE.md**: Cursor と Claude Code の特性比較・最適使い分け指針
- **AI_AGENT_MASTERY.md**: エージェントを統率するための実践ガイドライン
- **GROKBOT_FLEET.md**: Grok Bot による部署別（PM・企画・実装・QA・資料・安全）直列フリート運用方針
- **企画ブリーフ (usiness-ops/briefs/)**:
  - date-spark.md: デートマンネリ化解消アプリ企画書
  - dopagaki-blocker.md: ドパガキ対策・集中支援アプリ企画書
- **プロンプトテンプレート (usiness-ops/templates/prompts/)**:
  - ハッカソン提出物一括自動生成プロンプト
  - Grok Bot フリート用プロンプト集

### 3. Date Spark 開発基盤 (date-spark/)
- ハッカソン#24 採用企画の実装リソース・要件定義・プロトタイプ
