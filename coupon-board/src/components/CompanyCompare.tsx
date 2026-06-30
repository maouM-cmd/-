"use client";

import { useMemo, useState } from "react";
import type { AiCompany, AiModel } from "@/lib/ai-kit";
import { GUMROAD_URL } from "@/lib/ai-kit";

interface CompanyCompareProps {
  companies: AiCompany[];
  models: AiModel[];
}

function formatUsdB(value: number | null) {
  if (value == null) return "—";
  return `$${value}B`;
}

function formatUsdM(value: number | null) {
  if (value == null) return "—";
  return `$${value}M`;
}

function CompanyPanel({
  company,
  models,
}: {
  company: AiCompany;
  models: AiModel[];
}) {
  const latest = models
    .filter((m) => m.companyId === company.id)
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))[0];

  return (
    <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
      <p className="mt-1 text-sm text-gray-500">{company.headquarters}</p>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        {company.description}
      </p>

      <dl className="mt-5 grid gap-3 text-sm">
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <dt className="text-gray-500">Valuation</dt>
          <dd className="font-semibold">{formatUsdB(company.valuationUsdB)}</dd>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <dt className="text-gray-500">Employees</dt>
          <dd className="font-semibold">
            {company.employees?.toLocaleString() ?? "—"}
          </dd>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <dt className="text-gray-500">Revenue</dt>
          <dd className="font-semibold">{formatUsdM(company.revenueUsdM)}</dd>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <dt className="text-gray-500">Founded</dt>
          <dd className="font-semibold">{company.founded}</dd>
        </div>
        {latest && (
          <>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">Latest model</dt>
              <dd className="font-semibold">{latest.name}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">Context</dt>
              <dd className="font-semibold">
                {latest.contextWindowK ? `${latest.contextWindowK}K` : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">API price (in/out per 1M)</dt>
              <dd className="font-semibold">
                ${latest.inputPricePer1M ?? "—"} / $
                {latest.outputPricePer1M ?? "—"}
              </dd>
            </div>
          </>
        )}
      </dl>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {company.keyProducts.slice(0, 4).map((p) => (
          <span
            key={p}
            className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs text-violet-700"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CompanyCompare({ companies, models }: CompanyCompareProps) {
  const [leftId, setLeftId] = useState(companies[0]?.id ?? "");
  const [rightId, setRightId] = useState(companies[1]?.id ?? "");

  const left = useMemo(
    () => companies.find((c) => c.id === leftId),
    [companies, leftId]
  );
  const right = useMemo(
    () => companies.find((c) => c.id === rightId),
    [companies, rightId]
  );

  return (
    <div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Company A</span>
          <select
            value={leftId}
            onChange={(e) => setLeftId(e.target.value)}
            className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-sm"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Company B</span>
          <select
            value={rightId}
            onChange={(e) => setRightId(e.target.value)}
            className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-sm"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {left && right && (
        <div className="grid gap-6 lg:grid-cols-2">
          <CompanyPanel company={left} models={models} />
          <CompanyPanel company={right} models={models} />
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 p-6 text-center">
        <p className="text-sm text-gray-600">
          This tool uses 5 companies from the free kit. The full kit includes 10
          companies + Cursor agent docs.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a
            href="/kit"
            className="rounded-full border border-violet-300 px-5 py-2.5 text-sm font-medium text-violet-700 hover:bg-white"
          >
            View full kit
          </a>
          <a
            href={GUMROAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md"
          >
            Get kit — $39
          </a>
        </div>
      </div>
    </div>
  );
}
