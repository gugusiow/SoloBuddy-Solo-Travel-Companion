import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import * as Location from "expo-location";
import { HomeView } from "../native-views/homeView.jsx";
import { setWishlistItem } from "../firebaseModel.js";
import { searchPlacesByTextACB } from "../services/placesService.js";

const HomePresenter = observer(function HomePresenter(props) {
  const model = props.model;

  async function getUserLocationACB() {
    if (
      model.currentLocation?.latitude != null &&
      model.currentLocation?.longitude != null
    ) {
      return model.currentLocation;
    }

    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== "granted") {
      throw new Error("Location permission denied");
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const nextLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    model.setCurrentLocation?.(nextLocation);
    return nextLocation;
  }

  async function userWantsToRefreshWeatherACB() {
    const location = await getUserLocationACB();
    console.log("[weather] got location", location);
    model.fetchWeatherBanner(location.latitude, location.longitude);
    console.log("[weather]", model.weatherBannerPromiseState);
  }

  async function userWantsToRefreshSafetyAlertsACB() {
    model.setLoading?.(true);
    try {
      if (!model.weatherBannerPromiseState.data) {
        await userWantsToRefreshWeatherACB();
      }
      model.updateWeatherAlerts();
    } catch (error) {
      console.error("Failed to refresh safety alerts:", error);
      model.setWeatherAlerts?.([
        {
          event: "Safety alerts unavailable",
          description:
            error.message === "Location permission denied"
              ? "Enable location permission to check alerts for your current area."
              : "We could not load local safety alerts right now.",
        },
      ]);
    } finally {
      model.setLoading?.(false);
    }
  }

  async function userWantsToOpenWeatherDetailsACB() {
    try {
      const location = await getUserLocationACB();
      model.fetchWeatherDetails(location.latitude, location.longitude);
    } catch (error) {
      console.error("Failed to load weather details:", error);
    }
  }

  // change to use expo library instead
  async function userWantsToRefreshNewsACB() {
    try {
      const location = model.currentLocation;
      if (!location) return;
      const [place] = await Location.reverseGeocodeAsync({ latitude: location.latitude, longitude: location.longitude });
      const city = [place?.city, place?.country].filter(Boolean).join(" ") || null;
      console.log("[news] city:", city);
      if (!city) return;
      // change here for different query.... but search results arent rlly good tbvh
      model.fetchNews(`${city} AND (safety OR tourist)`);
    } catch (error) {
      console.error("Failed to refresh news:", error);
    }
  }

  async function loadHomeScreenDataACB() {
    model.setLoading?.(true);
    try {
      await userWantsToRefreshWeatherACB();
      const location = await getUserLocationACB();
      model.fetchAttractions(location.latitude, location.longitude);

      if (!model.weatherAlerts || model.weatherAlerts.length === 0) {
        model.updateWeatherAlerts();
      }
    } catch (error) {
      console.error("Failed to load home screen data:", error);
      model.setWeatherAlerts?.([
        {
          event: "Weather unavailable",
          description:
            error.message === "Location permission denied"
              ? "Enable location permission to show weather for your current position."
              : "We could not load weather for your location right now.",
        },
      ]);
    } finally {
      model.setLoading?.(false);
    }
  }

  function userWantsToSelectAttractionACB(attraction) {
    console.log("Selected attraction:", attraction?.name);
    model.setCurrentAttraction(attraction);
  }

  function userWantsToSeeMoreAttractionACB(attraction) {
    model.setCurrentAttraction(attraction);
    model.fetchPlaceDetails(attraction.id);
  }

  function userWantsToCloseAttractionDetailsACB() {
    model.clearPlaceDetails();
  }

  async function userWantsToSearchPlacesACB(query) {
    if (!query?.trim()) {
      model.clearMapSearchResults();
      return;
    }
    model.setMapSearchLoading(true);
    try {
      const location = model.currentLocation;
      const results = await searchPlacesByTextACB(
        query.trim(),
        location?.latitude ?? null,
        location?.longitude ?? null
      );
      model.setMapSearchResults(results);
    } catch (error) {
      console.error("Place search failed:", error);
      model.setMapSearchResults([]);
    } finally {
      model.setMapSearchLoading(false);
    }
  }

  function userWantsToClearSearchACB() {
    model.clearMapSearchResults();
  }

  // save attraction into the user's wishlist
  async function userWantsToAddToWishlistACB() {
    // check to make sure it's the actual user
    if (!model.currentUser || !model.currentAttraction?.id) {
      return;
    }
    const attraction = model.currentAttraction;
    // set the fields of the wishlist cards 
    await setWishlistItem(model.currentUser.uid, {
      id: attraction.id,
      name: attraction.name || "Untitled",
      location: attraction.location || "",
      imageUrl: attraction.imageUrl || "",
      description: attraction.shortDescription || "",
      userRating: attraction.userRating ?? null,
      lat: attraction.lat ?? null,
      lng: attraction.lng ?? null,
    });
  }

  useEffect(function loadInitialDataACB() {
    loadHomeScreenDataACB();
  }, []);

  useEffect(
    function refreshNewsOnLoginACB() {
      if (model.currentUser) {
        userWantsToRefreshNewsACB();
      }
    },
    [model.currentUser]
  );

  const weatherDetailsLoading =
    !!model.weatherDetailsPromiseState.promise &&
    !model.weatherDetailsPromiseState.data &&
    !model.weatherDetailsPromiseState.error;

  const placeDetailsLoading =
    !!model.placeDetailsPromiseState.promise &&
    !model.placeDetailsPromiseState.data &&
    !model.placeDetailsPromiseState.error;

  return (
    <HomeView
      attractions={model.attractionsPromiseState.data || []}
      currentAttraction={model.currentAttraction}
      currentWeather={
        model.weatherBannerPromiseState.data
          ? { ...model.weatherBannerPromiseState.data, ...(model.weatherDetailsPromiseState.data || {}) }
          : null
      }
      weatherAlerts={model.weatherAlerts || []}
      weatherDetailsLoading={weatherDetailsLoading}
      onOpenWeatherDetails={userWantsToOpenWeatherDetailsACB}
      touristNews={model.newsPromiseState.data || []}
      loadingStatus={model.loadingStatus}
      onRefreshSafetyAlerts={userWantsToRefreshSafetyAlertsACB}
      onRefreshNews={userWantsToRefreshNewsACB}
      onSelectAttraction={userWantsToSelectAttractionACB}
      onSeeMoreAttraction={userWantsToSeeMoreAttractionACB}
      placeDetails={model.placeDetailsPromiseState.data}
      placeDetailsLoading={placeDetailsLoading}
      onCloseAttractionDetails={userWantsToCloseAttractionDetailsACB}
      onAddToWishlist={userWantsToAddToWishlistACB}
      mapSearchResults={model.mapSearchResults}
      mapSearchLoading={model.mapSearchLoading}
      onSearchPlaces={userWantsToSearchPlacesACB}
      onClearSearch={userWantsToClearSearchACB}
    />
  );
});

export default HomePresenter;
