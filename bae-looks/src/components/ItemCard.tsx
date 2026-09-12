import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import type { IdentifiedItem } from "@/lib/types";

export function ItemCard({
  item,
  index,
}: {
  item: IdentifiedItem;
  index: number;
}) {
  return (
    <article
      className="card-enter rounded-2xl border border-[var(--line)] bg-[rgba(16,20,31,0.88)] p-5 backdrop-blur-md"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-muted)]">
          {item.category}
        </p>
        <ConfidenceBadge level={item.confidence} />
      </div>

      <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight">
        {item.brandName}
      </h3>
      <p className="mt-1 text-base text-[var(--ink-muted)]">{item.productName}</p>
      <p className="mt-1 text-sm text-[var(--accent)]">{item.modelCandidate}</p>

      <dl className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--ink-muted)]">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.18em] text-[var(--ink)]/70">
            Color / Texture
          </dt>
          <dd className="mt-1">
            {item.primaryColor} · {item.materialsTexture}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.18em] text-[var(--ink)]/70">
            Distinctive marks
          </dt>
          <dd className="mt-1">{item.distinctiveMarks}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.18em] text-[var(--ink)]/70">
            Why this guess
          </dt>
          <dd className="mt-1">{item.confidenceNote}</dd>
        </div>
      </dl>

      <p className="mt-5 text-lg font-semibold text-[var(--ink)]">
        {item.priceHint}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {item.links.map((link) => (
          <a
            key={link.href + link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {link.label}
          </a>
        ))}
      </div>

      {item.alternatives.length > 0 && (
        <div className="mt-5 border-t border-[var(--line)] pt-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            プチプラ / 概念コーデ
          </p>
          <ul className="mt-2 space-y-2">
            {item.alternatives.map((alt) => (
              <li
                key={alt.label}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <span>
                  <span className="text-[var(--ink)]">{alt.label}</span>
                  <span className="mt-0.5 block text-[var(--ink-muted)]">
                    {alt.note}
                  </span>
                </span>
                <span className="shrink-0 text-[var(--accent-hot)]">
                  {alt.priceHint}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
