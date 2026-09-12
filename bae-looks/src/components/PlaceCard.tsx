import type { PlaceEvent } from "@/lib/types";

export function PlaceCard({
  event,
  index,
}: {
  event: PlaceEvent;
  index: number;
}) {
  return (
    <article
      className="card-enter rounded-2xl border border-[var(--line)] bg-[rgba(16,20,31,0.88)] p-5 backdrop-blur-md"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-muted)]">
          Place
        </p>
        <span className="rounded-md border border-[rgba(61,224,196,0.35)] bg-[rgba(61,224,196,0.12)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
          訪問ログ
        </span>
      </div>

      <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight">
        {event.name}
      </h3>
      <p className="mt-1 text-sm text-[var(--accent)]">{event.area}</p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
        {event.sceneNote}
      </p>

      <dl className="mt-5 space-y-1 text-sm text-[var(--ink-muted)]">
        <div>
          {event.sourceLabel}
          {event.timestamp !== "—" ? ` · @${event.timestamp}` : ""}
        </div>
        <div>訪問目安: {event.visitedAt}</div>
        {event.companionNote ? <div>{event.companionNote}</div> : null}
      </dl>

      <a
        href={event.mapQuery}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        地図で開く
      </a>
    </article>
  );
}
