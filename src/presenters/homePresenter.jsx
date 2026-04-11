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
    model.setLoading(true);

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

      model.setWeatherAlerts(mockAlerts);
    } catch (error) {
      console.error("Failed to fetch attraction data:", error);
    } finally {
      model.setLoading(false);
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
      loadingStatus={model.loading}
      weatherAlerts={model.weatherAlerts}
      attractions={model.attractions || []}
      onRefresh={userWantsToRefreshDataACB}
      onSelectAttraction={userWantsToSelectAttractionACB}
    />
  );
});

export default HomePresenter;