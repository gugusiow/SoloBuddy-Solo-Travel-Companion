import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import * as Location from "expo-location";
import { HomeView } from "../native-views/homeView.jsx";
import { enrichAttractionsWithCoordinates } from "../services/googleMapsService.js";
import {
  fetchWeatherBannerACB,
  buildWeatherAlertsACB,
} from "../services/weatherService.js";

const mockAttractions = [
  {
    id: 1,
    name: "Gamla Stan",
    location: "Stockholm, Sweden",
    safetyRating: 4.7,
    imageUrl:
      "https://images.unsplash.com/photo-1571580649299-7c5d76d4cb8c?auto=format&fit=crop&w=1200&q=80",
    shortDescription:
      "Historic old town with walkable streets, busy squares, and popular tourist spots.",
  },
  {
    id: 2,
    name: "Djurgården",
    location: "Stockholm, Sweden",
    safetyRating: 4.8,
    imageUrl:
      "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=1200&q=80",
    shortDescription:
      "Popular island park area with museums, waterfront paths, and family attractions.",
  },
  {
    id: 3,
    name: "Södermalm",
    location: "Stockholm, Sweden",
    safetyRating: 4.5,
    imageUrl:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    shortDescription:
      "Trendy district with viewpoints, shopping streets, nightlife, and many visitors.",
  },
];

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

    const weather = await fetchWeatherBannerACB(
      location.latitude,
      location.longitude
    );

    model.setCurrentWeather?.(weather);
  }

  async function userWantsToRefreshSafetyAlertsACB() {
    model.setLoading?.(true);

    try {
      if (!model.currentWeather) {
        await userWantsToRefreshWeatherACB();
      }

      const weatherAlerts = buildWeatherAlertsACB(model.currentWeather);

      const fallbackSafetyAlerts =
        weatherAlerts.length > 0
          ? weatherAlerts
          : [
              {
                event: "No major local incidents reported",
                description:
                  "No robbery, accident, earthquake, or severe weather alert is currently flagged for your area.",
              },
            ];

      model.setWeatherAlerts?.(fallbackSafetyAlerts);
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

      const baseAttractions =
        model.attractions && model.attractions.length > 0
          ? model.attractions
          : mockAttractions;

      const enrichedAttractions = await enrichAttractionsWithCoordinates(
        baseAttractions
      );

      model.setAttractions?.(enrichedAttractions);

      if (!model.weatherAlerts || model.weatherAlerts.length === 0) {
        const startupAlerts = buildWeatherAlertsACB(model.currentWeather);
        model.setWeatherAlerts?.(startupAlerts);
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

  return (
    <HomeView
      attractions={model.attractions || []}
      currentAttraction={model.currentAttraction}
      currentWeather={model.currentWeather}
      weatherAlerts={model.weatherAlerts || []}
      touristNews={model.touristNews || []}
      loadingStatus={model.loadingStatus}
      onRefreshSafetyAlerts={userWantsToRefreshSafetyAlertsACB}
      onRefreshNews={userWantsToRefreshNewsACB}
      onSelectAttraction={userWantsToSelectAttractionACB}
    />
  );
});

export default HomePresenter;