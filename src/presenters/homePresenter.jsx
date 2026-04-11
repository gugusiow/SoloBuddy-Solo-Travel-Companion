import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { HomeView } from "../native-views/homeView.jsx";
import { enrichAttractionsWithCoordinates } from "../services/googleMapsService.js";

const seedAttractions = [
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
];

const HomePresenter = observer(function HomePresenter(props) {
  const model = props.model;

  async function userWantsToRefreshDataACB() {
    model.setLoading?.(true);

    try {
      const baseAttractions =
        model.attractions && model.attractions.length > 0
          ? model.attractions
          : seedAttractions;

      const enrichedAttractions = await enrichAttractionsWithCoordinates(
        baseAttractions
      );

      model.setAttractions?.(enrichedAttractions);

      const mockAlerts = [
        {
          event: "Heavy Rain",
          description: "Bring an umbrella and expect slippery streets.",
        },
      ];

      const mockTouristNews = [
        {
          id: 1,
          area: "Gamla Stan",
          severity: "Advisory",
          title: "Large weekend crowds expected in the old town",
          summary:
            "Visitors are advised to keep bags zipped and valuables secure in busy squares and narrow streets.",
          publishedAt: "Updated 2h ago",
        },
        {
          id: 2,
          area: "Djurgården",
          severity: "Transport",
          title: "Ferry and tram delays affecting museum routes",
          summary:
            "Some routes to major attractions may take longer than usual during peak visitor hours.",
          publishedAt: "Updated 45m ago",
        },
        {
          id: 3,
          area: "Södermalm",
          severity: "Crowds",
          title: "Evening congestion near popular nightlife streets",
          summary:
            "Travelers should expect denser foot traffic and plan pickup points in advance after dark.",
          publishedAt: "Updated 1h ago",
        },
      ];

      model.setWeatherAlerts?.(mockAlerts);
      model.setTouristNews?.(mockTouristNews);
    } catch (error) {
      console.error("Failed to fetch attraction data:", error);
    } finally {
      model.setLoading?.(false);
    }
  }

  function userWantsToSelectAttractionACB(attraction) {
    model.setCurrentAttraction?.(attraction);
    console.log("Selected attraction:", attraction?.name);
  }

  useEffect(function loadInitialDataACB() {
    if (!model.attractions || model.attractions.length === 0) {
      userWantsToRefreshDataACB();
    }
  }, []);

  return (
    <HomeView
      attractions={model.attractions || []}
      weatherAlerts={model.weatherAlerts || []}
      touristNews={model.touristNews || []}
      currentAttraction={model.currentAttraction}
      loadingStatus={model.loadingStatus}
      onRefresh={userWantsToRefreshDataACB}
      onSelectAttraction={userWantsToSelectAttractionACB}
    />
  );
});

export default HomePresenter;