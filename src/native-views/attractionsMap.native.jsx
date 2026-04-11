import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Mapbox from "@rnmapbox/maps";

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

if (MAPBOX_TOKEN) {
  Mapbox.setAccessToken(MAPBOX_TOKEN);
}

// this is for native, like iOS and Android
export function AttractionsMap({ attractions }) {
  const mappableAttractions = useMemo(function computeMappableACB() {
    return (attractions || []).filter(function hasCoordinatesACB(attraction) {
      return (
        Number.isFinite(attraction.latitude) &&
        Number.isFinite(attraction.longitude)
      );
    });
  }, [attractions]);

  const center = useMemo(function computeCenterACB() {
    if (!mappableAttractions.length) {
      return [0, 20];
    }

    const total = mappableAttractions.reduce(
      function addCoordinatesACB(acc, attraction) {
        return {
          latitude: acc.latitude + attraction.latitude,
          longitude: acc.longitude + attraction.longitude,
        };
      },
      { latitude: 0, longitude: 0 }
    );

    return [
      total.longitude / mappableAttractions.length,
      total.latitude / mappableAttractions.length,
    ];
  }, [mappableAttractions]);

  if (!MAPBOX_TOKEN) {
    return (
      <View style={[styles.map, styles.messageContainer]}>
        <Text style={styles.messageText}>
          Add EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN to your env file to load the map.
        </Text>
      </View>
    );
  }

  return (
    <Mapbox.MapView style={styles.map}>
      <Mapbox.Camera
        zoomLevel={mappableAttractions.length > 0 ? 11 : 2}
        centerCoordinate={center}
      />

      {mappableAttractions.map(function renderMarkerACB(attraction) {
        return (
          <Mapbox.PointAnnotation
            key={attraction.id.toString()}
            id={attraction.id.toString()}
            coordinate={[attraction.longitude, attraction.latitude]}
            title={attraction.name}
          >
            <View style={styles.marker} />
          </Mapbox.PointAnnotation>
        );
      })}
    </Mapbox.MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 420,
  },
  messageContainer: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  messageText: {
    color: "#374151",
    fontSize: 14,
  },
  marker: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#ef4444",
    borderWidth: 2,
    borderColor: "#fff",
  },
});