import type { Metadata } from "next";
import Link from "next/link";
import { GITHUB_FREE_URL, GUMROAD_URL } from "@/lib/ai-kit";

export const metadata: Metadata = {
  title: "AI Industry Dashboard Kit for Cursor",
  description:
    "Seed data + TypeScript schemas + agent-ready docs. Build an AI company dashboard in one Cursor session. $39 one-time.",
  openGraph: {
    title: "AI Industry Dashboard Kit for Cursor",
    description: "10 companies, typed schemas, Claude context generator. Ship in one session.",
  },
};

const FEATURES = [
  {
    title: "10 AI companies seed data",
    desc: "OpenAI, Anthropic, DeepMind, Meta, Mistral, Cohere, xAI, Perplexity, Stability AI, NVIDIA — valuations, employees, products.",
  },
  {
    title: "TypeScript schemas",
    desc: "Typed contracts for companies, models, funding, news. No guesswork for Cursor.",
  },
  {
    title: "Agent-ready docs",
    desc: "Requirements + component spec written for Claude/Cursor to implement directly.",
  },
  {
    title: "Context generator",
    desc: "One command → CLAUDE_CONTEXT.md with all data, specs, and types bundled.",
  },
];

const STEPS = [
  "Unzip the kit and run `node scripts/generate-claude-context.mjs`",
  "Open in Cursor and attach CLAUDE_CONTEXT.md",
  "Prompt: build dashboard with Next.js + Tailwind + Recharts",
  "Deploy to Vercel — launch on Product Hunt",
];

const COMPARISON = [
  { name: "Generic SaaS boilerplate", price: "$49–100", data: "None", agent: "No" },
  { name: "ChatGPT prompt packs", price: "$5–19", data: "None", agent: "No" },
  { name: "This kit", price: "$39", data: "10 companies", agent: "Yes" },
];

export default function KitPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-violet-950 to-fuchsia-950 p-8 text-white shadow-xl sm:p-12">
        <p className="text-sm font-medium text-violet-300">For Cursor & Claude builders</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          AI Industry Dashboard Kit
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-violet-100">
          Seed data + schemas + agent docs. Build a production AI company
          dashboard in one Cursor session — not another generic boilerplate.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={GUMROAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-6 py-3 text-sm font-bold text-violet-900 shadow-lg transition hover:bg-violet-50"
          >
            Get the kit — $39
          </a>
          <Link
            href="/tools/compare"
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Try free compare tool
          </Link>
          <a
            href={GITHUB_FREE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Free tier on GitHub
          </a>
        </div>
      </div>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm"
          >
            <h2 className="font-bold text-gray-900">{f.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-violet-100 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">How it works</h2>
        <ol className="mt-4 space-y-3">
          {STEPS.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-gray-700">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900">Why this kit</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-violet-100">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-violet-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Domain data</th>
                <th className="px-4 py-3 font-medium">Agent-ready</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.name} className="border-t border-violet-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-3 text-gray-600">{row.price}</td>
                  <td className="px-4 py-3 text-gray-600">{row.data}</td>
                  <td className="px-4 py-3 text-gray-600">{row.agent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12 rounded-2xl bg-violet-50 p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">Ready for Product Hunt?</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-gray-600">
          Use this page as your launch URL. The free compare tool drives SEO traffic
          without X or note.
        </p>
        <a
          href={GUMROAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-3 text-sm font-bold text-white shadow-md"
        >
          Buy now — $39
        </a>
      </section>

      <p className="mt-8 text-center text-xs text-gray-400">
        Demo data for educational purposes only. Not investment advice.
      </p>
    </div>
  );
}
