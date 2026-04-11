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

export function AttractionsMap({ attractions }) {
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

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

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

// comment out the mapbox/maps first coz it doesn't work
// import React, { useMemo } from "react";
// import { StyleSheet, Text, View } from "react-native";
// import Mapbox from "@rnmapbox/maps";

// const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

// if (MAPBOX_TOKEN) {
//   Mapbox.setAccessToken(MAPBOX_TOKEN);
// }

// // this is for native, like iOS and Android
// export function AttractionsMap({ attractions }) {
//   const mappableAttractions = useMemo(function computeMappableACB() {
//     return (attractions || []).filter(function hasCoordinatesACB(attraction) {
//       return (
//         Number.isFinite(attraction.latitude) &&
//         Number.isFinite(attraction.longitude)
//       );
//     });
//   }, [attractions]);

//   const center = useMemo(function computeCenterACB() {
//     if (!mappableAttractions.length) {
//       return [0, 20];
//     }

//     const total = mappableAttractions.reduce(
//       function addCoordinatesACB(acc, attraction) {
//         return {
//           latitude: acc.latitude + attraction.latitude,
//           longitude: acc.longitude + attraction.longitude,
//         };
//       },
//       { latitude: 0, longitude: 0 }
//     );

//     return [
//       total.longitude / mappableAttractions.length,
//       total.latitude / mappableAttractions.length,
//     ];
//   }, [mappableAttractions]);

//   if (!MAPBOX_TOKEN) {
//     return (
//       <View style={[styles.map, styles.messageContainer]}>
//         <Text style={styles.messageText}>
//           Add EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN to your env file to load the map.
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <Mapbox.MapView style={styles.map}>
//       <Mapbox.Camera
//         zoomLevel={mappableAttractions.length > 0 ? 11 : 2}
//         centerCoordinate={center}
//       />

//       {mappableAttractions.map(function renderMarkerACB(attraction) {
//         return (
//           <Mapbox.PointAnnotation
//             key={attraction.id.toString()}
//             id={attraction.id.toString()}
//             coordinate={[attraction.longitude, attraction.latitude]}
//             title={attraction.name}
//           >
//             <View style={styles.marker} />
//           </Mapbox.PointAnnotation>
//         );
//       })}
//     </Mapbox.MapView>
//   );
// }

// const styles = StyleSheet.create({
//   map: {
//     width: "100%",
//     height: 420,
//   },
//   messageContainer: {
//     backgroundColor: "#f3f4f6",
//     paddingHorizontal: 14,
//     justifyContent: "center",
//   },
//   messageText: {
//     color: "#374151",
//     fontSize: 14,
//   },
//   marker: {
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     backgroundColor: "#ef4444",
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
// });