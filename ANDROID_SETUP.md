# CARLAUN — Android app setup

This project now wraps the existing Next.js app as a native Android app using
[Capacitor](https://capacitorjs.com/). Capacitor takes the static export of the
web app and loads it inside a native WebView shell, so the entire UI you already
have (screens, cart, store, animations) works unchanged — you get a real,
installable `.apk`/`.aab` you can build and sign in Android Studio.

## What was added

- `next.config.mjs` — `output: 'export'` so `next build` produces a static
  `out/` folder (no Node server required, which is what Capacitor needs).
- `capacitor.config.ts` — app id `com.carlaun.app`, app name `CARLAUN`,
  `webDir: 'out'`, purple (`#5b21b6`) background/splash colors matching the
  brand.
- `android/` — the full native Android Studio project (Gradle project,
  manifest, generated launcher icons at every density, splash screens for
  light/dark and portrait/landscape).
- `assets/` — the source icon/splash images (1024×1024 icon, adaptive icon
  foreground/background, 2732×2732 splash) generated from the existing
  `public/icon.svg` mark, used by `@capacitor/assets` to regenerate Android
  assets any time you change the logo.
- `@capacitor/splash-screen` wired into `app/providers.tsx` — the native
  splash stays up until the app has mounted, then hides itself.
- npm scripts: `android:sync`, `android:open`, `android:assets`.

## One-time setup (on your machine)

```bash
npm install
```

## Everyday workflow

Any time you change the app's UI/code:

```bash
npm run android:open
```

This runs `next build` (static export to `out/`), copies it into the native
project (`npx cap sync android`), and opens the project in Android Studio.
From Android Studio, just hit **Run** ▶️ with an emulator or a plugged-in
device selected.

If Android Studio is already open and you just want to push a new build into
it without relaunching the IDE:

```bash
npm run android:sync
```

Then click **Sync Project with Gradle Files** (elephant icon) in Android
Studio if it doesn't auto-detect the change.

## Building a release APK/AAB

In Android Studio: **Build → Generate Signed App Bundle / APK**, then follow
the wizard to create (or reuse) a signing key. That signed `.aab` is what you
upload to the Play Console; a signed `.apk` can be installed directly on a
device for testing/sideloading.

## Changing the icon or splash screen

1. Replace `assets/icon.png` (1024×1024) and/or `assets/splash.png` /
   `assets/splash-dark.png` (2732×2732, centered artwork with generous
   padding — Android crops splash images aggressively on different screens).
2. Run:
   ```bash
   npm run android:assets
   ```
3. Re-sync: `npm run android:sync`.

## Notes / things to know

- **First build needs internet.** `next/font` downloads Inter and Plus
  Jakarta Sans from Google Fonts once at build time and bundles them into the
  static output — after that, the app needs no network access to render its
  UI/fonts. If you're ever building behind a firewall that blocks
  `fonts.googleapis.com`, either allow that domain during the build step, or
  swap the two `next/font/google` imports in `app/layout.tsx` for
  `next/font/local` with downloaded `.woff2` files.
- **No backend.** Cart/orders/navigation history all live in memory
  (`lib/store.tsx`) — there's no persistence yet, so state resets on app
  restart. That's unchanged from the web prototype; if you want data to
  survive restarts, that's a separate piece of work (e.g. add
  `@capacitor/preferences` for simple local persistence, or a real backend).
- **Min/target SDK**: Capacitor's defaults were used — `minSdkVersion 24`
  (Android 7.0+), `targetSdkVersion 36`. Adjust in
  `android/variables.gradle` if you need a different floor.
- **App id**: `com.carlaun.app`. Change it in `capacitor.config.ts` *before*
  your first Play Store upload — the application id can't be changed later
  without publishing as a new app.
