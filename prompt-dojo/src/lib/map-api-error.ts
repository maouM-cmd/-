type TranslateFn = (key: string) => string;

interface ApiErrorBody {
  errorCode?: string;
  error?: string;
}

export function mapApiError(
  data: ApiErrorBody,
  t: TranslateFn,
  fallback = "GENERIC_ERROR",
): string {
  if (data.errorCode) {
    const key = `errors.${data.errorCode}`;
    try {
      const translated = t(key);
      if (translated !== key) return translated;
    } catch {
      // fall through
    }
  }
  if (data.error) return data.error;
  try {
    return t(`errors.${fallback}`);
  } catch {
    return fallback;
  }
}
