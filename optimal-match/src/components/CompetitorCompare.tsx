import { COMPETITIVE_PILLARS, COMPETITOR_TABLE } from "@/lib/insights";

export function CompetitorCompare() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {COMPETITIVE_PILLARS.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"
          >
            <h3 className="font-bold text-rose-600">{p.title}</h3>
            <p className="mt-2 text-sm text-gray-700">{p.subtitle}</p>
            <p className="mt-2 text-xs text-gray-400">vs {p.vs}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rose-100 bg-rose-50/50">
              <th className="px-4 py-3 text-left font-medium text-gray-600">機能</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">スワイプ型</th>
              <th className="px-4 py-3 text-left font-medium text-rose-600">最適人探し</th>
            </tr>
          </thead>
          <tbody>
            {COMPETITOR_TABLE.map((row) => (
              <tr key={row.feature} className="border-b border-rose-50 last:border-0">
                <td className="px-4 py-3 text-gray-800">{row.feature}</td>
                <td className="px-4 py-3 text-gray-500">{row.swipeApps}</td>
                <td className={`px-4 py-3 font-medium ${row.advantage ? "text-emerald-700" : "text-gray-500"}`}>
                  {row.optimalMatch}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
