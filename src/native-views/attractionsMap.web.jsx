import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Map, { Marker } from "react-map-gl/mapbox";

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

// this is for the web, but like Leo said, we should focus on mobile app. I just added this to make it easier to visualise on my PC
export function AttractionsMap({ attractions }) {
  useEffect(function loadMapboxCssACB() {
    const styleTagId = "mapbox-gl-css";
    const existingTag = document.getElementById(styleTagId);

    if (existingTag) {
      return;
    }

    const link = document.createElement("link");
    link.id = styleTagId;
    link.rel = "stylesheet";
    link.href = "https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.css";
    document.head.appendChild(link);
  }, []);

  const center = useMemo(function computeCenterACB() {
    const mappableAttractions = (attractions || []).filter(function hasCoordinatesACB(attraction) {
      return Number.isFinite(attraction.latitude) && Number.isFinite(attraction.longitude);
    });

    if (!mappableAttractions.length) {
      return { latitude: 20, longitude: 0 };
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

    return {
      latitude: total.latitude / mappableAttractions.length,
      longitude: total.longitude / mappableAttractions.length,
    };
  }, [attractions]);

  const mappableAttractions = useMemo(function getMappableAttractionsACB() {
    return (attractions || []).filter(function hasCoordinatesACB(attraction) {
      return Number.isFinite(attraction.latitude) && Number.isFinite(attraction.longitude);
    });
  }, [attractions]);

  const [viewState, setViewState] = useState({
    longitude: center.longitude,
    latitude: center.latitude,
    zoom: 3,
  });

  useEffect(
    function syncCenterToDataACB() {
      setViewState(function updateViewStateACB(previous) {
        return {
          ...previous,
          longitude: center.longitude,
          latitude: center.latitude,
        };
      });
    },
    [center.longitude, center.latitude]
  );

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
    <Map
      style={styles.map}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      {...viewState}
      onMove={function onMoveACB(event) {
        setViewState(event.viewState);
      }}
    >
      {mappableAttractions.map(function renderMarkerACB(attraction) {
        return (
          <Marker
            key={String(attraction.id)}
            longitude={attraction.longitude}
            latitude={attraction.latitude}
            anchor="bottom"
          >
            <View style={styles.marker}>
              <Text style={styles.markerEmoji}>📍</Text>
            </View>
          </Marker>
        );
      })}
    </Map>
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
  marker: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  markerEmoji: {
    fontSize: 14,
    lineHeight: 18,
  },
});
