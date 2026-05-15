# Travel Safety Companion

SoloBuddy is a Travel Safety Companion App targeted at solo-travellers. The main use of the app is to alert the user of potential dangers in the area they are travelling in/intend to travel to. Important data like safety/crime-levels, rampant pickpocketing, or even natural disasters will be provided to users, along with tips for a safe solo travel experience.

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

NOTE: this will be fixed after mid proj review... for now do Step 3 for AppleMaps in IOS. 
4. **Run a dev build (required for maps on Android)**

   The `android/` and `ios/` folders are gitignored. You need to regenerate them first:

   ```bash
   npx expo prebuild
   ```

   Then create `android/local.properties` with Gmaps API key and add the Android SDK path if it is not added automatically. (can c&p API key from given .env file)

   ```
   GOOGLE_MAPS_API_KEY=your_google_api_key_here
   ```

   Then run:

   ```bash
   # Android (requires Android Studio + emulator)
   npx expo run:android

   # iOS (requires Xcode)
   npx expo run:ios
   ```

---

## Tech Stack (for now, add ltr)

- [React Native](https://reactnative.dev/) + [Expo SDK 55](https://expo.dev/)
- [Expo Router](https://expo.github.io/router/) — file-based navigation
- [MobX](https://mobx.js.org/) — reactive state management

---

