import { Platform } from "react-native";

// created this new file to call the Gmaps API and use it to get location data
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

let googleMapsScriptPromise = null;

function buildQueryFromAttraction(attraction) {
  return [attraction?.name, attraction?.location].filter(Boolean).join(", ");
}

function normalizeGeocodeResult(attraction, result) {
  if (!result) {
    return attraction;
  }

  return {
    ...attraction,
    latitude: result.latitude,
    longitude: result.longitude,
    placeId: result.placeId || attraction.placeId,
  };
}

async function loadGoogleMapsScriptOnWeb() {
  if (Platform.OS !== "web") {
    return null;
  }

  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error("Missing EXPO_PUBLIC_GOOGLE_MAPS_API_KEY");
  }

  if (window.google?.maps) {
    return window.google.maps;
  }

  if (!googleMapsScriptPromise) {
    googleMapsScriptPromise = new Promise(function resolveScriptPromise(resolve, reject) {
      const existingScript = document.getElementById("google-maps-script");

      if (existingScript) {
        existingScript.addEventListener("load", function handleLoad() {
          resolve(window.google.maps);
        });

        existingScript.addEventListener("error", reject);
        return;
      }

      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = function handleLoad() {
        resolve(window.google.maps);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  return googleMapsScriptPromise;
}

async function geocodeAttractionOnWeb(query) {
  const maps = await loadGoogleMapsScriptOnWeb();

  if (maps.importLibrary) {
    await maps.importLibrary("geocoding");
  }

  const geocoder = new window.google.maps.Geocoder();
  const response = await geocoder.geocode({ address: query });
  const firstResult = response.results?.[0];

  if (!firstResult) {
    return null;
  }

  return {
    latitude: firstResult.geometry.location.lat(),
    longitude: firstResult.geometry.location.lng(),
    placeId: firstResult.place_id,
  };
}

async function geocodeAttractionOnNative(query) {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error("Missing EXPO_PUBLIC_GOOGLE_MAPS_API_KEY");
  }

  const url =
    "https://maps.googleapis.com/maps/api/geocode/json?" +
    `address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();
  const firstResult = data.results?.[0];

  if (!firstResult) {
    return null;
  }

  return {
    latitude: firstResult.geometry.location.lat,
    longitude: firstResult.geometry.location.lng,
    placeId: firstResult.place_id,
  };
}

export async function enrichAttractionWithCoordinates(attraction) {
  const query = buildQueryFromAttraction(attraction);

  if (!query) {
    return attraction;
  }

  try {
    const result =
      Platform.OS === "web"
        ? await geocodeAttractionOnWeb(query)
        : await geocodeAttractionOnNative(query);

    return normalizeGeocodeResult(attraction, result);
  } catch (error) {
    console.error("Failed to geocode attraction:", attraction?.name, error);
    return attraction;
  }
}

export async function enrichAttractionsWithCoordinates(attractions = []) {
  const enrichedAttractions = await Promise.all(
    attractions.map(enrichAttractionWithCoordinates)
  );

  return enrichedAttractions; // this is just a var of the attraction with the coords
}