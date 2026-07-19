import { scoreToRank } from "./constants";
import type { EvaluationResult, PromptCheck } from "./types";

interface CheckRule {
  label: string;
  maxPoints: number;
  tip: string;
  test: (text: string) => boolean;
}

const RULES: CheckRule[] = [
  {
    label: "役割の明示",
    maxPoints: 20,
    tip: "「あなたは〜の専門家です」「You are a ...」のように役割を与えましょう。",
    test: (text) =>
      /あなたは.{2,30}(です|であって|として)/.test(text) ||
      /you are (a |an )?.{3,40}/i.test(text) ||
      /役割[:：]/.test(text) ||
      /ロール[:：]/i.test(text),
  },
  {
    label: "タスクの明確さ",
    maxPoints: 25,
    tip: "何をしてほしいか、動詞で具体的に指示しましょう（作成・要約・分析・翻訳など）。",
    test: (text) =>
      /(作成|生成|書いて|要約|分析|翻訳|説明|提案|比較|列挙|評価|改善|校正|チェック|まとめ)/.test(
        text,
      ) ||
      /(create|generate|write|summarize|analyze|translate|explain|compare|list|evaluate|improve)/i.test(
        text,
      ),
  },
  {
    label: "出力形式の指定",
    maxPoints: 20,
    tip: "JSON、箇条書き、表形式、文字数など、出力の形式を指定しましょう。",
    test: (text) =>
      /(json|箇条書き|表形式|マークダウン|markdown|箇条書|番号付き|表で|リスト形式)/i.test(
        text,
      ) ||
      /\d+\s*(字|文字|words?|行)/i.test(text) ||
      /出力形式|形式で|フォーマット|format/i.test(text),
  },
  {
    label: "制約・条件",
    maxPoints: 20,
    tip: "「必ず」「禁止」「〜以内」「含めないで」など制約を明示しましょう。",
    test: (text) =>
      /(必ず|禁止|してはいけない|含めない|避けて|以内|以上|以下|だけ|のみ|条件)/.test(
        text,
      ) ||
      /(must|don't|do not|avoid|within|only|constraint|require)/i.test(text),
  },
  {
    label: "文脈・背景",
    maxPoints: 15,
    tip: "対象読者、用途、前提情報などの背景を伝えましょう。",
    test: (text) =>
      /(対象|読者|ターゲット|用途|背景|前提|シチュエーション|状況|目的|コンテキスト|想定)/.test(
        text,
      ) ||
      /(audience|context|background|purpose|scenario|for .{3,30})/i.test(text) ||
      text.length >= 120,
  },
];

export function evaluatePrompt(text: string): EvaluationResult {
  const trimmed = text.trim();
  const checks: PromptCheck[] = RULES.map((rule) => {
    const passed = trimmed.length > 0 && rule.test(trimmed);
    return {
      label: rule.label,
      passed,
      tip: rule.tip,
      points: passed ? rule.maxPoints : 0,
      maxPoints: rule.maxPoints,
    };
  });

  const score = checks.reduce((sum, c) => sum + c.points, 0);
  return {
    score,
    rank: scoreToRank(score),
    checks,
  };
}
