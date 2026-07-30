export const NATIVE_PUSH_TOKEN_KEY = "prompt-dojo-native-push-token";

export function getStoredNativePushToken(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  return sessionStorage.getItem(NATIVE_PUSH_TOKEN_KEY);
}

export function setStoredNativePushToken(token: string): void {
  sessionStorage.setItem(NATIVE_PUSH_TOKEN_KEY, token);
}

export function clearStoredNativePushToken(): void {
  sessionStorage.removeItem(NATIVE_PUSH_TOKEN_KEY);
}
