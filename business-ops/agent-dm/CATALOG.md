# 既存の MCP / Skill / GitHub（先にこれを見る）

自前の `agent-dm.mjs` は **Cloud Agent と Windows の Claude がプロセスを共有できないとき** のフォールバック。同じ PC なら公式・既存の方が会話になる。

コミュニティ MCP の `--yolo` / `--dangerously-skip-permissions` は使わない。

## どれを使うか

| 状況 | 使うもの | リアルタイムか |
|------|----------|----------------|
| 同じ Windows で Cursor が Claude に作業を渡す | **公式 `claude mcp serve`** | 同じマシンのツール呼び出し |
| 同じ Windows で Claude が Cursor CLI をワーカーにする | **Cursor CLI + 薄い bridge**（任意） | サブエージェント |
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

Windows で `claude` が PATH に無いときは、`where.exe claude` のフルパスを `command` に書く。例は [`mcp.json.example`](../../.cursor/mcp.json.example)。

使い方: Cursor に「claude-code MCP でこのファイルを直して」と明示する。Cursor が Claude のツールを呼ぶ。**Cloud Agent の VM には `claude` が無いので、これは自宅 PC 専用。**

## 2. 公式に近い: Claude から Cursor CLI を呼ぶ

Cursor 側の会話相手は CLI `agent`（旧 `cursor-agent`）。[CLI MCP](https://cursor.com/docs/cli/mcp.md)

Claude Code が「安いワーカーとして Cursor を使う」パターンの実装例:

| リポジトリ | 向き |
|------------|------|
| [JaimeJunr/cursor-mcp-bridge](https://github.com/JaimeJunr/cursor-mcp-bridge) | Claude / Codex から `agent -p` に委譲。model / effort 付き |
| [jonaspauleta/cursor-bridge](https://github.com/jonaspauleta/cursor-bridge) | `run_cursor_agent`。Composer をワーカーに |
| [thsunkid/orchestrate-cursor-agent-mcp](https://github.com/thsunkid/orchestrate-cursor-agent-mcp) | 多ターン IPC。重い |

入れるなら **cursor-mcp-bridge** が薄い。権限スキップ系は拒否。自宅 PC で `agent` がログイン済みのときだけ。

## 3. 本格 inbox: MCP Agent Mail

「エージェント同士のメール」として一番枯れている。

- Python 元祖: [Dicklesworthstone/mcp_agent_mail](https://github.com/Dicklesworthstone/mcp_agent_mail)（2000 星前後）
- サイト: [mcpagentmail.com](https://mcpagentmail.com/)

inbox、スレッド、ファイル予約（同時編集防止）、Git 監査。ツール数が多く、デーモンが要る。**一人で Cursor と Claude を繋ぐだけなら過剰。** エージェントを常時複数動かすようになったら検討。

より小さい同じ系統:

- [andrealaforgia/agents-mailbox](https://github.com/andrealaforgia/agents-mailbox) — 共有フォルダ + `send` / `inbox`。同じマシン限定
- [signalclaude/interagent](https://github.com/signalclaude/interagent) — Claude Code 同士向け

## 4. 会話ではなくコンテキスト同期

[theamazingwolf/cursor-bridge-mcp](https://github.com/theamazingwolf/cursor-bridge-mcp) は `.cursor/rules` と skills を Claude Code に見せる。**DM ではない。** サイロ解消には効く。

## 5. GitHub 上でやる（Cloud でも使える）

Issue / PR コメントが公共の inbox。公式 [GitHub MCP](https://github.com/github/github-mcp-server) か、すでにある `gh`。

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
同じ PC:     1 → 足りなければ 2
常時複数:    3
Cloud↔自宅:  5 または agent-dm.mjs
スキル共有:  4
```
