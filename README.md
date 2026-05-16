# Travel Safety Companion

SoloBuddy is a Travel Safety Companion App targeted at solo-travellers. The main use of the app is to alert the user of potential dangers in the area they are travelling in/intend to travel to. Important data like safety/crime-levels, rampant pickpocketing, or even natural disasters will be provided to users, along with tips for a safe solo travel experience.

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Expo Go](https://expo.dev/go) on your phone
- [Android Studio](https://developer.android.com/studio) (for Android emulator)
- [Xcode](https://developer.apple.com/xcode/) (for iOS simulator)

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

## Tech Stack (for now, add ltr)

- [React Native](https://reactnative.dev/) + [Expo SDK 55](https://expo.dev/)
- [Expo Router](https://expo.github.io/router/) — file-based navigation
- [MobX](https://mobx.js.org/) — reactive state management

## External APIs

| API | Purpose |
|-----|---------|
| [Google Places API (New)](https://developers.google.com/maps/documentation/places/web-service) | Nearby attractions, text search, place details |
| [Google Weather API](https://developers.google.com/maps/documentation/weather) | Current conditions, 7-day forecast, UV index |
| [Google Air Quality API](https://developers.google.com/maps/documentation/air-quality) | Real-time Air Quality Index (AQI) |
| [UK Foreign Travel Advisory](https://www.gov.uk/foreign-travel-advice) | Official UK government travel safety alerts |
| [US State Dept. Travel Advisory](https://travel.state.gov/) | US travel safety level (1–4) by country |
| [NewsAPI](https://newsapi.org/) | Recent news articles for the destination |
| [OpenRouter](https://openrouter.ai/) | AI-generated day-by-day travel itinerary |
| [Firebase Auth](https://firebase.google.com/docs/auth) | User authentication |
| [Firebase Firestore](https://firebase.google.com/docs/firestore) | User profiles, wishlist, community posts (real-time) |
| [Firebase Storage](https://firebase.google.com/docs/storage) | Profile photo upload and hosting |

## Key Architectural Patterns & Code Highlights

### 1. resolvePromise: Elegant Async State Handling
All asynchronous API calls flow through a centralized `resolvePromise` utility (`src/resolvePromise.js`) rather than cluttering components with scattered `useState` or `useEffect` hooks. It encapsulates the promise, resolved data, and error state into a plain object that **MobX observes reactively**.

```javascript
// model.js
fetchAttractions(lat, lng) {
  resolvePromise(fetchAttractionsACB(lat, lng), this.attractionsPromiseState);
}
```

A crucial detail is the **stale-response guard**: if a new API request is fired before the previous one resolves, the older result is silently discarded because the reference check ensures only the latest promise updates the state.

```javascript
// resolvePromise.js
function successACB(result) {
  if (promiseState.promise === promise) { // Guard against stale responses
    promiseState.data = result;
  }
}

```

Views conditionally render UI elements by reactively reading `.promise`, `.data`, and `.error` from the `promiseState` object.

### 2. MobX Observer Pattern: Decoupled Presenters & Views

Presenters are wrapped in MobX's `observer()`, enabling them to **automatically re-render** whenever any observable field they consume from the model changes. This completely eliminates manual subscriptions or brittle `useEffect` dependency arrays for sync tracking.

```javascript
// homePresenter.jsx
const HomePresenter = observer(function HomePresenter(props) {
  const model = props.model;
  
  // Reading model.attractionsPromiseState.data here establishes an automatic 
  // reactive dependency. The component re-renders instantly when data updates.
  return (
    <HomeView ... // []} attractions="{model.attractionsPromiseState.data" ||/>
  );
});

```

Architecture Note: Views themselves are *not* observers. They remain plain React components that receive data and callbacks strictly via `props`, keeping the UI layer fully decoupled from MobX.

### 3. Firebase Real-Time Listeners: Live Data Syncing

Instead of one-off data fetching, features like the user wishlist and community posts utilize Firestore's `onSnapshot` for live, bi-directional synchronization. Any database modification (whether from this device or another) is pushed to the client instantly without polling.

```javascript
// wishlistService.js
export function listenToWishlist(uid, onUpdate) {
  const q = query(collection(db, "users", uid, "wishlist"), orderBy("createdAt", "desc"));
  
  unsubscribeWishlist = onSnapshot(q, (snap) => {
    const items = [];
    snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
    onUpdate(items); // Updates the MobX model via model.setWishlist(items)
  });
}

```

The presenter triggers this subscription within a `useEffect` hook and returns the `unsubscribe` function as a cleanup phase, ensuring zero memory leaks when a user logs out or unmounts the view.

### 4. Auth Gate & Session Resolution in Root Layout

To provide a seamless UX, the authentication state is fully resolved before rendering any application screens. The root `_layout.jsx` triggers `connectToAuth(model)` on mount, which flips `model.ready = true` only after Firebase confirms the user session.

```javascript
// _layout.jsx
if (!model.ready) return <Text>Loading...</Text>;
if (!model.currentUser) return <AuthPresenter model="{model}"/>;

return <Tabs>...</Tabs>; // Renders main application tabs once authenticated

```

By holding the render state until the session is verified, we successfully prevent the jarring "login screen flash" for already-authenticated users.

### 5. Cross-Platform Map Layer via Extension Resolution

The mapping feature leverages React Native's automated **platform file resolution** (`.native.jsx` vs `.web.jsx`) to deliver high-performance UI tailored to each runtime environment while maintaining a unified interface.

```text
├── attractionsMap.native.jsx  ← Automatically loaded on iOS & Android (react-native-maps)
└── attractionsMap.web.jsx     ← Automatically loaded in Browser (@vis.gl/react-google-maps)

```

Both files export components accepting identical prop types. As a result, the rest of the codebase remains agnostic of the underlying platform split, maximizing code reuse.
