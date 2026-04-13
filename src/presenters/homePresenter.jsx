import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import * as Location from "expo-location";
import { HomeView } from "../native-views/homeView.jsx";


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

  async function userWantsToRefreshNewsACB() {
    try {
      const mockTouristNews = [
        {
          id: 1,
          area: "Gamla Stan",
          severity: "Advisory",
          title: "Large weekend crowds expected in the old town",
          summary:
            "Visitors are advised to keep bags zipped and valuables secure in busy squares and narrow streets.",
          publishedAt: "Updated recently",
        },
        {
          id: 2,
          area: "Djurgården",
          severity: "Transport",
          title: "Ferry delays affecting museum routes",
          summary:
            "Some ferry departures may run late during peak sightseeing hours.",
          publishedAt: "Updated 1h ago",
        },
        {
          id: 3,
          area: "Södermalm",
          severity: "Crowds",
          title: "Evening congestion near nightlife streets",
          summary:
            "Travelers should expect denser foot traffic and plan pickup points ahead of time.",
          publishedAt: "Updated 45m ago",
        },
      ];
      model.setTouristNews?.(mockTouristNews);
    } catch (error) {
      console.error("Failed to refresh tourist news:", error);
      model.setTouristNews?.([]);
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
    model.setCurrentAttraction?.(attraction);
    console.log("Selected attraction:", attraction?.name);
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
      touristNews={model.touristNews || []}
      loadingStatus={model.loadingStatus}
      onRefreshSafetyAlerts={userWantsToRefreshSafetyAlertsACB}
      onRefreshNews={userWantsToRefreshNewsACB}
      onSelectAttraction={userWantsToSelectAttractionACB}
    />
  );
});

export default HomePresenter;
