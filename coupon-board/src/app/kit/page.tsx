import type { Metadata } from "next";
import Link from "next/link";
import { GITHUB_FREE_URL, GITHUB_REPO_URL } from "@/lib/ai-kit";

export const metadata: Metadata = {
  title: "AI Dashboard Kit — Developer Hub",
  description:
    "Cursor agent kit: seed data, TypeScript schemas, and docs to build an AI industry dashboard. GitHub-first.",
};

const FEATURES = [
  {
    title: "Seed data",
    desc: "AI companies, models, funding, news — structured JSON, not scraped HTML.",
  },
  {
    title: "TypeScript schemas",
    desc: "Typed contracts so Cursor does not guess field names.",
  },
  {
    title: "Agent docs",
    desc: "Requirements and component spec written for Claude/Cursor.",
  },
  {
    title: "Context generator",
    desc: "One script → CLAUDE_CONTEXT.md for a single-session build.",
  },
];

const QUICKSTART = [
  "git clone <repo> && cd ai-dashboard-kit/free",
  "cp -r data ../your-app/src/data/",
  "Open in Cursor → paste the prompt from free/README.md",
];

export default function KitPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-violet-950 to-fuchsia-950 p-8 text-white shadow-xl sm:p-12">
        <p className="text-sm font-medium text-violet-300">Developer kit · GitHub-first</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          AI Industry Dashboard Kit
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-violet-100">
          For Cursor builders. Data + schemas + agent docs — not another generic
          SaaS boilerplate or prompt pack.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={GITHUB_FREE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-6 py-3 text-sm font-bold text-violet-900 shadow-lg transition hover:bg-violet-50"
          >
            View on GitHub
          </a>
          <Link
            href="/tools/compare"
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Live demo — Compare tool
          </Link>
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
        <h2 className="text-xl font-bold text-gray-900">Quick start</h2>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-violet-100">
          {QUICKSTART.join("\n")}
        </pre>
        <p className="mt-4 text-sm text-gray-600">
          Full instructions in{" "}
          <a
            href={`${GITHUB_REPO_URL}/blob/main/ai-dashboard-kit/free/README.md`}
            className="text-violet-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            ai-dashboard-kit/free/README.md
          </a>
        </p>
      </section>

      <section className="mt-12 rounded-2xl bg-violet-50 p-8">
        <h2 className="text-xl font-bold text-gray-900">Distribution strategy</h2>
        <p className="mt-2 text-sm text-gray-600">
          This project is oriented around GitHub — stars, forks, and technical
          posts — not note or X. Build in public on Zenn/Qiita when ready.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>1. Polish the free tier README until clone → dashboard is obvious</li>
          <li>2. Write one technical post with screenshots</li>
          <li>3. Share on Cursor forum / r/cursor when you have a demo</li>
          <li>4. Consider GitHub Sponsors after traction — not Gumroad-first</li>
        </ul>
      </section>

      <p className="mt-8 text-center text-xs text-gray-400">
        Demo data for educational purposes. Not investment advice.
      </p>
    </div>
  );
}
