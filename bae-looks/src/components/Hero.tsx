import { SITE } from "@/data/moments";

export function Hero() {
  return (
    <header className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(61,224,196,0.18),transparent_55%),radial-gradient(ellipse_at_20%_80%,rgba(255,107,74,0.16),transparent_45%),linear-gradient(160deg,#0b1020_0%,#07090f_55%,#05060a_100%)]" />
        <div className="absolute -right-24 top-10 h-[70vh] w-[70vh] rounded-full bg-[rgba(61,224,196,0.08)] blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--bg-deep)] to-transparent" />
        <div className="grain" />
      </div>

      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <p className="font-display text-sm font-bold tracking-[0.28em]">
          {SITE.brand}
        </p>
        <a
          href="#context"
          className="text-sm text-[var(--ink-muted)] transition hover:text-[var(--accent)]"
        >
          Context
        </a>
      </nav>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-6xl flex-col justify-center px-4 pb-24 pt-8 sm:px-6">
        <p className="animate-rise text-xs uppercase tracking-[0.35em] text-[var(--accent)]">
          {SITE.member} · frontend trial
        </p>
        <h1 className="animate-rise-delay-1 font-display mt-5 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
          {SITE.brand}
        </h1>
        <p className="animate-rise-delay-1 mt-6 max-w-xl text-lg text-[var(--ink-muted)] sm:text-xl">
          {SITE.tagline}
        </p>
        <p className="animate-rise-delay-2 mt-3 max-w-lg text-sm leading-relaxed text-[var(--ink-muted)]/90">
          {SITE.support}
        </p>
        <div className="animate-rise-delay-2 mt-10 flex flex-wrap gap-3">
          <a
            href="#context"
            className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-bold text-[#04110e] transition hover:brightness-110"
          >
            ベイの今を見る
          </a>
          <a
            href="#demo"
            className="rounded-xl border border-[var(--line)] px-6 py-3 text-sm text-[var(--ink-muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            フレーム特定を試す
          </a>
        </div>
      </div>
    </header>
  );
}
