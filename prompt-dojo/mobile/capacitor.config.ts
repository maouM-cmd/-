import type { CapacitorConfig } from "@capacitor/cli";

const appBaseUrl = process.env.APP_BASE_URL ?? "https://example.com";

const config: CapacitorConfig = {
  appId: "com.promptdojo.app",
  appName: "Prompt Dojo",
  webDir: "www",
  server: {
    url: appBaseUrl,
    cleartext: appBaseUrl.startsWith("http://"),
  },
  plugins: {
    SplashScreen: {
      backgroundColor: "#4f46e5",
      launchShowDuration: 2000,
    },
    StatusBar: {
      backgroundColor: "#4f46e5",
      style: "LIGHT",
    },
  },
};

export default config;
