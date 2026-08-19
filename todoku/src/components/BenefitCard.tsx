import { CATEGORY_LABEL, formatMinutes, formatYen } from "@/lib/constants";
import type { MatchResult } from "@/lib/types";
import { ScoreRing } from "./ScoreRing";

export function BenefitCard({ result }: { result: MatchResult }) {
  const { benefit, eligible, score, reasons, gaps } = result;

  return (
    <article className="rounded-2xl border border-teal/10 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <ScoreRing score={score} eligible={eligible} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-stamp">
            {CATEGORY_LABEL[benefit.category]} ／ {benefit.agency}
          </p>
          <h3 className="mt-0.5 text-lg font-bold text-teal">{benefit.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink/75">{benefit.summary}</p>
        </div>
      </div>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div className="rounded-xl bg-sand/80 px-3 py-2">
          <dt className="text-xs text-teal/60">金額の目安</dt>
          <dd className="font-medium text-teal">{benefit.amountHint}</dd>
        </div>
        <div className="rounded-xl bg-sand/80 px-3 py-2">
          <dt className="text-xs text-teal/60">手取り・時短</dt>
          <dd className="font-medium text-teal">
            {benefit.annualYenHint > 0 ? `年${formatYen(benefit.annualYenHint)} ／ ` : ""}
            {formatMinutes(benefit.timeSavedMinutes)}
          </dd>
        </div>
      </dl>

      {eligible ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-moss">
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-stamp/80">
          {gaps.map((gap) => (
            <li key={gap}>{gap}</li>
          ))}
        </ul>
      )}

      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-ink/70">
        {benefit.procedureSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
        <a
          className="font-medium text-stamp underline decoration-stamp/30 underline-offset-2 hover:decoration-stamp"
          href={benefit.procedureUrl}
          target="_blank"
          rel="noreferrer"
        >
          手続・公式案内を開く
        </a>
        <span className="text-teal/50">{benefit.source.name}</span>
      </div>
    </article>
  );
}
