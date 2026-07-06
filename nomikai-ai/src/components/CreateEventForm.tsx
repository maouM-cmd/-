"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BUDGET_OPTIONS, MOOD_OPTIONS, TIME_SLOTS } from "@/lib/constants";
import type { DateOption, Mood } from "@/lib/types";

function defaultDateOptions(): DateOption[] {
  const dates: DateOption[] = [];
  const today = new Date();
  for (let i = 1; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i * 2);
    dates.push({
      date: d.toISOString().slice(0, 10),
      timeSlot: "evening",
    });
  }
  return dates;
}

export function CreateEventForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [budget, setBudget] = useState(5000);
  const [mood, setMood] = useState<Mood>("casual");
  const [dateOptions, setDateOptions] = useState<DateOption[]>(defaultDateOptions);
  const [expectedCount, setExpectedCount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateDateOption(index: number, field: keyof DateOption, value: string) {
    setDateOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt))
    );
  }

  function addDateOption() {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setDateOptions((prev) => [
      ...prev,
      { date: d.toISOString().slice(0, 10), timeSlot: "evening" },
    ]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          organizer_name: organizerName,
          budget,
          mood,
          date_options: dateOptions,
          expected_participant_count: expectedCount ? Number(expectedCount) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "作成に失敗しました");
        return;
      }
      router.push(data.organizer_url);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">飲み会のタイトル</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例: 部署忘年会"
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">幹事の名前</label>
        <input
          type="text"
          required
          value={organizerName}
          onChange={(e) => setOrganizerName(e.target.value)}
          placeholder="例: 田中"
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">予算（1人あたり）</label>
        <select
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-amber-400 focus:outline-none"
        >
          {BUDGET_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">雰囲気</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {MOOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMood(opt.value)}
              className={`min-h-[48px] rounded-xl border px-3 py-2 text-sm font-medium transition ${
                mood === opt.value
                  ? "border-amber-400 bg-amber-50 text-amber-800"
                  : "border-gray-200 bg-white text-gray-600 hover:border-amber-200"
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">日時候補</label>
        <div className="mt-2 space-y-3">
          {dateOptions.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="date"
                required
                value={opt.date}
                onChange={(e) => updateDateOption(i, "date", e.target.value)}
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm"
              />
              <select
                value={opt.timeSlot}
                onChange={(e) => updateDateOption(i, "timeSlot", e.target.value)}
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addDateOption}
          className="mt-2 text-sm text-amber-600 hover:text-amber-700"
        >
          + 候補日を追加
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          想定参加人数（任意）
        </label>
        <input
          type="number"
          min={1}
          value={expectedCount}
          onChange={(e) => setExpectedCount(e.target.value)}
          placeholder="例: 5"
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
        />
        <p className="mt-1 text-xs text-gray-500">
          設定すると、人数が揃ったとき幹事にプッシュ通知します（未設定時は通知なし）
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-amber-500 text-lg font-bold text-white hover:bg-amber-600 disabled:opacity-50"
      >
        {loading ? "作成中..." : "飲み会を作成する"}
      </button>
    </form>
  );
}
