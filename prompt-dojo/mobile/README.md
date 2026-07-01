# Prompt Dojo — Capacitor Mobile Shell

This directory wraps the deployed Prompt Dojo web app in a native WebView shell for iOS and Android. The app loads the production URL configured in `APP_BASE_URL` — no local Next.js build is bundled into the native project.

## Prerequisites

- Node.js 20+
- **Android:** Android Studio, JDK 17+
- **iOS (macOS only):** Xcode 15+, CocoaPods

Set the deployment URL:

```bash
export APP_BASE_URL=https://your-production-domain.example
```

## Setup

```bash
cd mobile
npm install
mkdir -p www
echo '<!DOCTYPE html><html><body>Loading…</body></html>' > www/index.html
npx cap add android   # optional
npx cap add ios       # optional, macOS only
npx cap sync
```

`capacitor.config.ts` reads `APP_BASE_URL` and points the WebView at your live site. Splash screen and status bar use brand color `#4f46e5`.

## Run on emulator / device

### Android

```bash
npx cap open android
# In Android Studio: Run on emulator or connected device
```

### iOS

```bash
npx cap open ios
# In Xcode: select simulator or device, then Run
```

## Deep links (optional)

To handle `prompt-dojo://` URLs, configure intent filters (Android) and URL schemes (iOS) in the native projects after `cap add`, then map paths to `APP_BASE_URL` in your app delegate / activity.

## App icons

Source icons live in the web app at `public/icons/` (192×192 and 512×512 PNG). After `cap add`, generate native launcher icons with [@capacitor/assets](https://github.com/ionic-team/capacitor-assets):

```bash
# From repo root — place a 1024×1024 source at assets/icon.png first
npm install -g @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor '#4f46e5' --splashBackgroundColor '#4f46e5'
```

Or copy `public/icons/icon-512.png` into Android `res/` and iOS `Assets.xcassets` manually.

## Notes

- CI does not build signed store binaries; use this README for local release builds.
- Push notifications require additional native plugins (out of Phase 6 scope).
- After changing `APP_BASE_URL` or Capacitor plugins, run `npx cap sync` again.
