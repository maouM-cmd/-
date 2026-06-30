import type { Metadata } from "next";
import Link from "next/link";
import { CompanyCompare } from "@/components/CompanyCompare";
import companies from "@/data/ai-companies.json";
import models from "@/data/ai-models.json";
import type { AiCompany, AiModel } from "@/lib/ai-kit";

export const metadata: Metadata = {
  title: "AI Company Compare — Free Tool",
  description:
    "Compare OpenAI, Anthropic, Google DeepMind, Meta AI, and Mistral side by side. Free demo from the AI Dashboard Kit.",
};

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/kit" className="text-sm text-violet-600 hover:text-violet-700">
        ← AI Dashboard Kit
      </Link>

      <section className="mt-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          AI Company Compare
        </h1>
        <p className="mt-2 text-gray-600">
          Side-by-side comparison of valuation, models, and API pricing. Powered
          by the free tier of our Cursor agent kit.
        </p>
      </section>

      <CompanyCompare
        companies={companies as AiCompany[]}
        models={models as AiModel[]}
      />
    </div>
  );
}
