import type { Template } from "@/lib/types";

export const TEMPLATES: Template[] = [
  {
    category: "job_hunting",
    name: "就活 標準セット",
    questions: [
      { question: "自己紹介（1分）", targetSeconds: 60 },
      { question: "志望動機", targetSeconds: 90 },
      { question: "学生時代に力を入れたこと（ガクチカ）", targetSeconds: 120 },
      { question: "強み・弱み", targetSeconds: 90 },
      { question: "入社後にやりたいこと", targetSeconds: 60 },
      { question: "他社状況・軸", targetSeconds: 60 },
      { question: "逆質問", targetSeconds: 60 },
    ],
  },
  {
    category: "career_change",
    name: "転職 標準セット",
    questions: [
      { question: "自己紹介（経歴概要）", targetSeconds: 60 },
      { question: "転職理由・志望動機", targetSeconds: 90 },
      { question: "前職の業務内容と成果", targetSeconds: 120 },
      { question: "なぜ今のタイミングで転職するか", targetSeconds: 90 },
      { question: "入社後に活かせるスキル", targetSeconds: 90 },
      { question: "希望条件（年収・勤務地など）", targetSeconds: 60 },
      { question: "逆質問", targetSeconds: 60 },
    ],
  },
];
