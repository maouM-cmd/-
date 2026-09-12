import type { InterestEvent } from "@/lib/types";

export function InterestCard({
  event,
  index,
}: {
  event: InterestEvent;
  index: number;
}) {
  return (
    <article
      className="card-enter rounded-2xl border border-[var(--line)] bg-[rgba(16,20,31,0.88)] p-5 backdrop-blur-md"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-muted)]">
          Interest
        </p>
        <span className="rounded-md border border-[rgba(255,214,102,0.35)] bg-[rgba(255,214,102,0.12)] px-2.5 py-1 text-xs font-semibold text-[#ffd666]">
          発言由来
        </span>
      </div>

      <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight">
        {event.label}
      </h3>
      <blockquote className="mt-3 border-l-2 border-[var(--accent)] pl-3 text-sm leading-relaxed text-[var(--ink-muted)]">
        「{event.quote}」
      </blockquote>

      <dl className="mt-5 space-y-2 text-sm text-[var(--ink-muted)]">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span>{event.sourceLabel}</span>
          <span>@{event.timestamp}</span>
          <span>{event.observedAt}</span>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        {event.relatedTags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-[var(--line)] px-2.5 py-1 text-xs text-[var(--ink-muted)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href={event.actionHref}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        {event.actionLabel}
      </a>
    </article>
  );
}
