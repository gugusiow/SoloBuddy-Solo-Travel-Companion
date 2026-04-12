import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

// web map using Google Maps via @vis.gl/react-google-maps
export function AttractionsMap({ attractions }) {
  const mappableAttractions = useMemo(function getMappableAttractionsACB() {
    return (attractions || []).filter(function hasCoordinatesACB(attraction) {
      return (
        Number.isFinite(attraction.latitude) &&
        Number.isFinite(attraction.longitude)
      );
    });
  }, [attractions]);

  const center = useMemo(function computeCenterACB() {
    if (!mappableAttractions.length) {
      return { lat: 20, lng: 0 };
    }

    const total = mappableAttractions.reduce(
      function addCoordinatesACB(acc, attraction) {
        return {
          lat: acc.lat + attraction.latitude,
          lng: acc.lng + attraction.longitude,
        };
      },
      { lat: 0, lng: 0 }
    );

    return {
      lat: total.lat / mappableAttractions.length,
      lng: total.lng / mappableAttractions.length,
    };
  }, [mappableAttractions]);

  if (!GOOGLE_API_KEY) {
    return (
      <View style={[styles.map, styles.messageContainer]}>
        <Text style={styles.messageText}>
          Add EXPO_PUBLIC_GOOGLE_API_KEY to your env file to load the map.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.map}>
      <APIProvider apiKey={GOOGLE_API_KEY}>
        <Map
          style={{ width: "100%", height: "100%" }}
          defaultCenter={center}
          defaultZoom={mappableAttractions.length > 0 ? 11 : 3}
          mapId="attractions-map"
        >
          {mappableAttractions.map(function renderMarkerACB(attraction) {
            return (
              <AdvancedMarker
                key={String(attraction.id ?? attraction.name)}
                position={{ lat: attraction.latitude, lng: attraction.longitude }}
                title={attraction.name}
              />
            );
          })}
        </Map>
      </APIProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 420,
    backgroundColor: "#e5e7eb",
  },
  messageContainer: {
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  messageText: {
    color: "#374151",
    fontSize: 14,
  },
});
