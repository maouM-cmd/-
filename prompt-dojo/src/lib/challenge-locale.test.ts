import { describe, expect, it } from "vitest";
import {
  localizeChallenge,
  localizeChallengeField,
  localizeChallengeTitle,
} from "./challenge-locale";
import type { Challenge } from "./types";

const baseChallenge: Challenge = {
  id: 1,
  title: "日本語タイトル",
  description: "日本語説明",
  sample_output: "日本語出力例",
  title_en: "English Title",
  description_en: "English description",
  sample_output_en: "English sample output",
  status: "active",
  author_id: null,
  category_id: 1,
  created_at: "2026-01-01",
};

describe("localizeChallengeField", () => {
  it("returns English when locale is en and translation exists", () => {
    expect(localizeChallengeField("日本語", "English", "en")).toBe("English");
  });

  it("falls back to Japanese when locale is en but translation is empty", () => {
    expect(localizeChallengeField("日本語", "", "en")).toBe("日本語");
    expect(localizeChallengeField("日本語", null, "en")).toBe("日本語");
  });

  it("returns Japanese for ja locale", () => {
    expect(localizeChallengeField("日本語", "English", "ja")).toBe("日本語");
  });
});

describe("localizeChallenge", () => {
  it("localizes all fields for en locale", () => {
    const localized = localizeChallenge(baseChallenge, "en");
    expect(localized.title).toBe("English Title");
    expect(localized.description).toBe("English description");
    expect(localized.sample_output).toBe("English sample output");
  });

  it("keeps Japanese fields for ja locale", () => {
    const localized = localizeChallenge(baseChallenge, "ja");
    expect(localized.title).toBe("日本語タイトル");
    expect(localized.description).toBe("日本語説明");
  });
});

describe("localizeChallengeTitle", () => {
  it("localizes title only", () => {
    expect(localizeChallengeTitle("日本語", "English", "en")).toBe("English");
    expect(localizeChallengeTitle("日本語", "English", "ja")).toBe("日本語");
  });
});
