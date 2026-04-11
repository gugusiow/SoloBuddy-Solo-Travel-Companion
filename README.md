# Travel Safety Companion

A mobile app for exploring attractions and staying safe while travelling.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Expo Go](https://expo.dev/go) on your phone
- [Android Studio](https://developer.android.com/studio) (for Android emulator)
- [Xcode](https://developer.apple.com/xcode/) (for iOS simulator)

---

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://gits-15.sys.kth.se/iprog-students/rameesha-siow-wslo-yyche-vt26-project
   cd rameesha-siow-wslo-yyche-vt26-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the dev server**

   ```bash
   npm run dev
   ```

Once running, press `?` to see all options, then:

| Key | Action |
|-----|--------|
| `w` | Open in web browser |
| `a` | Open in Android emulator |
| `i` | Open in iOS simulator (macOS only) |
| `s` | Scan QR code with Expo Go on your phone |

---

## Tech Stack (for now, add ltr)

- [React Native](https://reactnative.dev/) + [Expo SDK 55](https://expo.dev/)
- [Expo Router](https://expo.github.io/router/) — file-based navigation
- [MobX](https://mobx.js.org/) — reactive state management

---

## Map Setup (Mapbox)

This project uses [@rnmapbox/maps](https://github.com/rnmapbox/maps) for native map rendering (Android and iOS), with a web fallback so the map section still appears in desktop browser runs.

### 1. Create your token

1. Open https://console.mapbox.com/account/access-tokens/
2. Copy your public token (starts with `pk.`)

### 2. Add env variable

Create a `.env` file in the project root:

```bash
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_token_here
```

### 3. Install deps

```bash
npm install
```

### 4. Rebuild native project (required)

`@rnmapbox/maps` needs custom native code, so it does not run inside Expo Go.

```bash
npx expo prebuild --clean
```

### 5. Run native

Android:

```bash
npx expo run:android
```

iOS (macOS only):

```bash
npx expo run:ios
```

### 6. Run in browser (desktop)

```bash
npm run dev
```

Press `w` in the Expo terminal. On web, the map section uses a Mapbox static image fallback.
