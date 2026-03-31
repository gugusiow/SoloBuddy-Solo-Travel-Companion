// following https://github.com/expo/expo/issues/40513
export default {
  expo: {
    name: "project",
    slug: "project",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "project",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.project",
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
        },
      },
    },
    web: {
      bundler: "metro",
      output: "static",
    },
    plugins: ["expo-router", "expo-location"],
  },
};