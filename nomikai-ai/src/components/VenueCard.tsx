import type { VenueCandidate } from "@/lib/types";

export function VenueCard({ venue, index }: { venue: VenueCandidate; index: number }) {
  return (
    <a
      href={venue.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl border border-orange-100 bg-white p-4 shadow-sm transition hover:border-orange-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-orange-500">候補 {index + 1}</span>
            {venue.source === "places" && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                リアル店舗
              </span>
            )}
            {venue.rating != null && (
              <span className="text-xs text-amber-600">★ {venue.rating}</span>
            )}
          </div>
          <h4 className="mt-1 font-bold text-gray-900">{venue.name}</h4>
          <p className="mt-1 text-sm text-gray-600">{venue.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-700">
              {venue.type}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {venue.budgetLabel}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {venue.moodLabel}
            </span>
          </div>
        </div>
        <span className="shrink-0 text-orange-400">→</span>
      </div>
    </a>
  );
}
