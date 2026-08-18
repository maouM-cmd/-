# 既存の MCP / Skill / GitHub

**依頼が来たら先に `@agent-router`。** このカタログは引き渡し手段。判定表はルーター Skill にある。

自前の `agent-dm.mjs` は **Cloud Agent と Windows の Claude がプロセスを共有できないとき** のフォールバック。同じ PC なら公式 MCP / `agent -p`。

コミュニティ MCP の `--yolo` / `--dangerously-skip-permissions` は使わない。`.cursor/mcp.json` はコミットしない（Cloud に `claude` が無い）。

## できないこと（相手の中身）

相手の会話・思考・今開いている画面を、呼ばれずに覗く口は Cursor にも Claude Code にも無い。Agent Mail や常時デーモンは入れない。

| 層 | できるか |
|----|----------|
| 思考・チャットの中身 | 不可。セッションは各アプリに閉じる |
| 仕事の受け渡し | 可。MCP / `agent -p`。呼ばれた側だけが文を見る |
| 成果物 | 可。同じ git。相手の頭ではなくディスク上の結果 |
| 共有メール箱 | 起動時に agent-dm / gh を見る。Agent Mail デーモンは入れない |
| Cloud Agent ↔ 自宅 Claude | MCP も Agent Mail も届かない。Issue か agent-dm のみ |

### 起動時 inbox（エージェント起動時のみ。Tab ではやらない）

```bash
git pull --ff-only
node business-ops/scripts/agent-dm.mjs inbox --from <自分>
gh issue list --label agent-dm --state open
```

`gh` 失敗は無視。ラベル作成は人間。MCP に `fetch_inbox` があるときだけ 1 回呼ぶ。無ければ入れない。聞かない。inbox があれば処理。空なら今の依頼を続ける。相手の中身は増えない。見逃しが減るだけ。

## どれを使うか

| 状況 | 使うもの | リアルタイムか |
|------|----------|----------------|
| 同じ Windows で Cursor が Claude に作業を渡す | **公式 `claude mcp serve`** | 同じマシンのツール呼び出し |
| 同じ Windows で Claude が Cursor に UI / best-of-n を渡す | **公式 Cursor CLI `agent -p`** | サブエージェント |
| 任意で GitHub inbox | 公式 GitHub MCP または `gh`（[`.claude/mcp.json.example`](../../.claude/mcp.json.example)） | Issue |
| 複数エージェントの inbox が欲しい（同じマシン） | **MCP Agent Mail**（実績あり） | 非同期メール |
| スマホの Cloud Agent ↔ 自宅の Claude | **このリポの Agent DM** または GitHub Issue | git / Issue |
| スキルやルールを Claude にも読ませたい | **cursor-bridge-mcp**（コンテキスト同期。会話ではない） | 読み取り |

## 1. 公式: Cursor から Claude Code を呼ぶ（推奨・同じ PC）

Claude Code は MCP サーバーになれる。[公式ドキュメント](https://code.claude.com/docs/en/mcp)

```bash
claude mcp serve
```

Cursor の `~/.cursor/mcp.json`（またはプロジェクトの `.cursor/mcp.json`）:

```json
{
  "mcpServers": {
    "claude-code": {
      "command": "claude",
      "args": ["mcp", "serve"]
    }
  }
}
```

Windows で `claude` が PATH に無いときは、`where.exe claude` のフルパスを `command` に書く。自宅では次で自動:

```powershell
node business-ops/scripts/enable-local-mcp.mjs
```

例の手書きは [`mcp.json.example`](../../.cursor/mcp.json.example)。**Cloud Agent の VM には `claude` が無い。**

使い方: Cursor に「claude-code MCP でこのファイルを直して」と明示する。Cursor が Claude のツールを呼ぶ。**Cloud Agent の VM には `claude` が無いので、これは自宅 PC 専用。**

## 2. 公式: Claude から Cursor CLI を呼ぶ

Cursor CLI は `agent`（[docs](https://cursor.com/docs/cli/using.md)）。ルーターが `cursor` と判定したら:

```powershell
agent -p "coupon-board の一覧カード（DealCard）の余白を他カードと揃えて。触ってよい: coupon-board/src/components/DealCard.tsx と一覧グリッド。完了条件: 同じ行のカードの高さと内部余白が揃う。リファクタ禁止。聞かないで進めて。"
```

プロジェクト名が無くても「どれですか？」と聞かない。UI / 余白の既定は coupon-board。`agent` が PATH に無い / ログイン前なら agent-dm か `gh issue`。コミュニティの cursor-mcp-bridge は入れない（yolo になりがち）。

参考（入れない）: [JaimeJunr/cursor-mcp-bridge](https://github.com/JaimeJunr/cursor-mcp-bridge)、[jonaspauleta/cursor-bridge](https://github.com/jonaspauleta/cursor-bridge)

## 3. 本格 inbox: MCP Agent Mail

「エージェント同士のメール」として一番枯れている。

- Python 元祖: [Dicklesworthstone/mcp_agent_mail](https://github.com/Dicklesworthstone/mcp_agent_mail)（2000 星前後）
- サイト: [mcpagentmail.com](https://mcpagentmail.com/)

inbox、スレッド、ファイル予約（同時編集防止）、Git 監査。ツール数が多く、デーモンが要る。**未導入。** 一人で Cursor と Claude を繋ぐだけなら過剰。デーモンは入れない。`mcp.json` に足さない。ツール一覧に `fetch_inbox` があるときだけ起動時に 1 回呼ぶ。無ければ入れようとしない。

より小さい同じ系統:

- [andrealaforgia/agents-mailbox](https://github.com/andrealaforgia/agents-mailbox) — 共有フォルダ + `send` / `inbox`。同じマシン限定
- [signalclaude/interagent](https://github.com/signalclaude/interagent) — Claude Code 同士向け

## 4. 会話ではなくコンテキスト同期

[theamazingwolf/cursor-bridge-mcp](https://github.com/theamazingwolf/cursor-bridge-mcp) は `.cursor/rules` と skills を Claude Code に見せる。**DM ではない。** サイロ解消には効く。

## 5. GitHub 上でやる（Cloud でも使える）

Issue / PR コメントが公共の inbox。公式 [GitHub MCP](https://github.com/github/github-mcp-server)（例: [`.claude/mcp.json.example`](../../.claude/mcp.json.example)、トークンは環境変数）か、すでにある `gh`。MCP は任意。トークンをファイルに書かない。

```bash
gh issue create --title "agent-dm: lint 直して" --body "from: cursor → claude-code\n..."
gh issue comment <n> --body "from: claude-code\nやったこと: ..."
```

このモノレポは Issue がゼロ。使い始めるならラベル `agent-dm` を人間が作る。Cloud Agent は GitHub に届く。自宅 Claude は `gh issue list --label agent-dm`。

## 6. Skill 集（会話口そのものではない）

マルチエージェント用スキルは多いが、ほとんど **Claude の中のサブエージェント**。

- [wshobson/agents](https://github.com/wshobson/agents)
- [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode)
- [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills)

Cursor ↔ Claude の DM の代わりにはならない。日次 SOP を厚くするとき用。

## このリポの自前 CLI を残す理由

Cursor Cloud は隔離 VM。`claude mcp serve` も Agent Mail も、自宅の Claude プロセスに届かない。git のスレッド（または GitHub Issue）だけが Cloud → 自宅の配達になる。

```
同じ PC:     ルーター → 1（Cursor→Claude）または 2（Claude→Cursor）
Cloud↔自宅:  ルーター → 5 または agent-dm.mjs
常時複数:    3（まだ入れない）
スキル共有:  4
```
