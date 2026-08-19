import type { Persona } from "@/lib/types";

export function PersonaPicker({
  personas,
  selectedId,
  onSelect,
}: {
  personas: Persona[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {personas.map((persona) => {
        const active = persona.id === selectedId;
        return (
          <button
            key={persona.id}
            type="button"
            onClick={() => onSelect(persona.id)}
            className={`cursor-pointer rounded-2xl border px-4 py-4 text-left shadow-sm transition ${
              active
                ? "border-stamp bg-white ring-2 ring-stamp/30"
                : "border-teal/10 bg-paper hover:border-teal/30"
            }`}
          >
            <p className="text-xs font-medium text-stamp">{persona.title}</p>
            <p className="mt-1 font-bold text-teal">{persona.name}</p>
            <p className="mt-1 text-sm text-ink/70">{persona.blurb}</p>
          </button>
        );
      })}
    </div>
  );
}
