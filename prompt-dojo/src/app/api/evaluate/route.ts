import { NextResponse } from "next/server";
import { evaluatePrompt } from "@/lib/prompt-evaluator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const text = (body.prompt_text as string) ?? "";
  const locale = (body.locale as string) === "en" ? "en" : "ja";
  const result = evaluatePrompt(text, locale);
  return NextResponse.json(result);
}
