"use client";

import { useState } from "react";
import type { CreateProfileInput, LookingFor, Profile } from "@/lib/types";
import { INTEREST_TAGS, LOOKING_FOR_OPTIONS } from "@/lib/constants";

const DEFAULT_VALUES = { social: 3, career: 3, family: 3, adventure: 3 };

export function ProfileForm({ initial }: { initial: Profile | null }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [age, setAge] = useState(initial?.age ?? 28);
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [interests, setInterests] = useState<string[]>(initial?.interests ?? []);
  const [lookingFor, setLookingFor] = useState<LookingFor>(initial?.looking_for ?? "dating");
  const [values, setValues] = useState(initial?.values ?? DEFAULT_VALUES);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function toggleInterest(tag: string) {
    setInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 8 ? [...prev, tag] : prev
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || interests.length === 0) {
      setMessage("名前と興味を1つ以上入力してください");
      return;
    }
    setSaving(true);
    setMessage("");
    const body: CreateProfileInput = {
      name: name.trim(),
      age,
      bio: bio.trim(),
      interests,
      looking_for: lookingFor,
      values,
      is_me: true,
    };
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("保存しました！最適マッチを見てみましょう");
      window.location.href = "/discover";
    } else {
      setMessage("保存に失敗しました");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">名前</label>
        <input
          className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="あなたの名前"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">年齢</label>
        <input
          type="number"
          min={18}
          max={99}
          className="mt-1 w-24 rounded-xl border border-rose-200 px-3 py-2"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">自己紹介</label>
        <textarea
          className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="どんな人と出会いたいですか？"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">探している関係</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {LOOKING_FOR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setLookingFor(opt.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                lookingFor === opt.value
                  ? "bg-rose-500 text-white"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          興味・趣味（最大8つ）
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {INTEREST_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleInterest(tag)}
              className={`rounded-full px-3 py-1 text-sm transition ${
                interests.includes(tag)
                  ? "bg-rose-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-rose-50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">価値観（1〜5）</label>
        <div className="mt-3 space-y-3">
          {(
            [
              ["social", "社交性"],
              ["career", "キャリア"],
              ["family", "家族・安定"],
              ["adventure", "冒険・新しいこと"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-28 text-sm text-gray-600">{label}</span>
              <input
                type="range"
                min={1}
                max={5}
                value={values[key]}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [key]: Number(e.target.value) }))
                }
                className="flex-1 accent-rose-500"
              />
              <span className="w-4 text-sm font-bold text-rose-600">{values[key]}</span>
            </div>
          ))}
        </div>
      </div>
      {message && (
        <p className={`text-sm ${message.includes("失敗") ? "text-red-600" : "text-emerald-600"}`}>
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-rose-500 py-3 font-bold text-white hover:bg-rose-600 disabled:opacity-50"
      >
        {saving ? "保存中..." : "プロフィールを保存してマッチング開始"}
      </button>
    </form>
  );
}
