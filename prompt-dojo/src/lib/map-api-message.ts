type TranslateFn = (key: string) => string;

interface ApiMessageBody {
  messageCode?: string;
  message?: string;
}

export function mapApiMessage(
  data: ApiMessageBody,
  t: TranslateFn,
  fallback = "GENERIC_SUCCESS",
): string {
  if (data.messageCode) {
    const key = `messages.${data.messageCode}`;
    try {
      const translated = t(key);
      if (translated !== key) return translated;
    } catch {
      // fall through
    }
  }
  if (data.message) return data.message;
  try {
    return t(`messages.${fallback}`);
  } catch {
    return fallback;
  }
}
