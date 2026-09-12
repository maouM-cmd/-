import { ContextBoard } from "@/components/ContextBoard";
import { Hero } from "@/components/Hero";
import { IdentifyDemo } from "@/components/IdentifyDemo";
import { WhySection } from "@/components/WhySection";
import { SITE } from "@/data/moments";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ContextBoard />
      <IdentifyDemo />
      <WhySection />
      <footer className="border-t border-[var(--line)] px-4 py-10 text-center text-sm text-[var(--ink-muted)] sm:px-6">
        <p className="font-display tracking-[0.22em] text-[var(--ink)]">
          {SITE.brand}
        </p>
        <p className="mt-2">
          Frontend trial for {SITE.memberJa}. Items, interests, and places are
          demo guesses for UX review — not verified facts.
        </p>
      </footer>
    </main>
  );
}
