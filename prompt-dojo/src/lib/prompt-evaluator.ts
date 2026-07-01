import { scoreToRank } from "./constants";
import type { EvaluationResult, PromptCheck } from "./types";
import enMessages from "../../messages/en.json";
import jaMessages from "../../messages/ja.json";

type Locale = "ja" | "en";

interface CheckRule {
  labelKey: "roleLabel" | "taskLabel" | "formatLabel" | "constraintsLabel" | "contextLabel";
  tipKey: "roleTip" | "taskTip" | "formatTip" | "constraintsTip" | "contextTip";
  maxPoints: number;
  test: (text: string) => boolean;
}

const RULES: CheckRule[] = [
  {
    labelKey: "roleLabel",
    tipKey: "roleTip",
    maxPoints: 20,
    test: (text) =>
      /あなたは.{2,30}(です|であって|として)/.test(text) ||
      /you are (a |an )?.{3,40}/i.test(text) ||
      /役割[:：]/.test(text) ||
      /ロール[:：]/i.test(text),
  },
  {
    labelKey: "taskLabel",
    tipKey: "taskTip",
    maxPoints: 25,
    test: (text) =>
      /(作成|生成|書いて|要約|分析|翻訳|説明|提案|比較|列挙|評価|改善|校正|チェック|まとめ)/.test(
        text,
      ) ||
      /(create|generate|write|summarize|analyze|translate|explain|compare|list|evaluate|improve)/i.test(
        text,
      ),
  },
  {
    labelKey: "formatLabel",
    tipKey: "formatTip",
    maxPoints: 20,
    test: (text) =>
      /(json|箇条書き|表形式|マークダウン|markdown|箇条書|番号付き|表で|リスト形式)/i.test(
        text,
      ) ||
      /\d+\s*(字|文字|words?|行)/i.test(text) ||
      /出力形式|形式で|フォーマット|format/i.test(text),
  },
  {
    labelKey: "constraintsLabel",
    tipKey: "constraintsTip",
    maxPoints: 20,
    test: (text) =>
      /(必ず|禁止|してはいけない|含めない|避けて|以内|以上|以下|だけ|のみ|条件)/.test(
        text,
      ) ||
      /(must|don't|do not|avoid|within|only|constraint|require)/i.test(text),
  },
  {
    labelKey: "contextLabel",
    tipKey: "contextTip",
    maxPoints: 15,
    test: (text) =>
      /(対象|読者|ターゲット|用途|背景|前提|シチュエーション|状況|目的|コンテキスト|想定)/.test(
        text,
      ) ||
      /(audience|context|background|purpose|scenario|for .{3,30})/i.test(text) ||
      text.length >= 120,
  },
];

function getEvaluatorMessages(locale: Locale) {
  return locale === "en" ? enMessages.evaluator : jaMessages.evaluator;
}

export function evaluatePrompt(text: string, locale: Locale = "ja"): EvaluationResult {
  const trimmed = text.trim();
  const messages = getEvaluatorMessages(locale);

  const checks: PromptCheck[] = RULES.map((rule) => {
    const passed = trimmed.length > 0 && rule.test(trimmed);
    return {
      label: messages[rule.labelKey],
      passed,
      tip: messages[rule.tipKey],
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
