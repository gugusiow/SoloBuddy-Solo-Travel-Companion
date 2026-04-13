import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const DEFAULT_REGION = {
  latitude: 59.3293,
  longitude: 18.0686,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

export function AttractionsMap({ attractions, onSelectAttraction }) {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const mappableAttractions = useMemo(function computeMappableACB() {
    return (attractions || []).filter(function hasCoordinatesACB(attraction) {
      return (
        Number.isFinite(attraction.latitude) &&
        Number.isFinite(attraction.longitude)
      );
    });
  }, [attractions]);

  const fallbackRegion = useMemo(function computeFallbackRegionACB() {
    if (!mappableAttractions.length) {
      return DEFAULT_REGION;
    }

    const latitudes = mappableAttractions.map((item) => item.latitude);
    const longitudes = mappableAttractions.map((item) => item.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.05),
      longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.05),
    };
  }, [mappableAttractions]);

  useEffect(() => {
    let isMounted = true;

    async function loadUserLocationACB() {
      try {
        setIsLoadingLocation(true);

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          if (isMounted) {
            setPermissionDenied(true);
          }
          return;
        }

        const position = await Location.getLastKnownPositionAsync();

        if (!isMounted) {
          return;
        }

        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setUserLocation(coords);

        requestAnimationFrame(() => {
          mapRef.current?.animateToRegion(
            {
              ...coords,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            },
            800
          );
        });
      } catch (_error) {
      } finally {
        if (isMounted) {
          setIsLoadingLocation(false);
        }
      }
    }

    loadUserLocationACB();

    return function cleanupACB() {
      isMounted = false;
    };
  }, []);

  const initialRegion = userLocation
    ? {
        ...userLocation,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }
    : fallbackRegion;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={false}
      >
        {userLocation ? (
          <Marker
            coordinate={userLocation}
            title="You are here"
            pinColor="#2563eb"
          />
        ) : null}

        {mappableAttractions.map(function renderMarkerACB(attraction) {
          return (
            <Marker
              key={String(attraction.id ?? attraction.name)}
              coordinate={{
                latitude: attraction.latitude,
                longitude: attraction.longitude,
              }}
              title={attraction.name}
              description={attraction.description || attraction.address || ""}
              onPress={function onMarkerPressACB() {
                onSelectAttraction?.(attraction);
              }}
            />
          );
        })}
      </MapView>

      {isLoadingLocation ? (
        <View style={styles.overlay}>
          <ActivityIndicator size="small" color="#111827" />
          <Text style={styles.overlayText}>Finding your location…</Text>
        </View>
      ) : null}

      {permissionDenied ? (
        <View style={styles.permissionBanner}>
          <Text style={styles.permissionText}>
            Location permission was denied, so the map is centered on attractions
            instead.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: 420,
  },
  overlay: {
    position: "absolute",
    top: 12,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  overlayText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "600",
  },
  permissionBanner: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: "rgba(17,24,39,0.88)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  permissionText: {
    color: "#ffffff",
    fontSize: 13,
    textAlign: "center",
  },
});

