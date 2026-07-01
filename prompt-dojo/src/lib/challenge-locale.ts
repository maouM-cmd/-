import type { Challenge } from "./types";

export function localizeChallengeField(
  ja: string,
  en: string | null | undefined,
  locale: string,
): string {
  if (locale === "en" && en?.trim()) {
    return en.trim();
  }
  return ja;
}

export function localizeChallenge(challenge: Challenge, locale: string): Challenge {
  if (locale !== "en") {
    return challenge;
  }
  return {
    ...challenge,
    title: localizeChallengeField(challenge.title, challenge.title_en, locale),
    description: localizeChallengeField(
      challenge.description,
      challenge.description_en,
      locale,
    ),
    sample_output: localizeChallengeField(
      challenge.sample_output,
      challenge.sample_output_en,
      locale,
    ),
  };
}

export function localizeChallengeTitle(
  title: string,
  titleEn: string | null | undefined,
  locale?: string,
): string {
  if (!locale || locale !== "en") {
    return title;
  }
  return localizeChallengeField(title, titleEn, locale);
}
