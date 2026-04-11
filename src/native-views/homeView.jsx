import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import { AttractionCard } from "./attractionCard";
import { AttractionsMap } from "./attractionsMap";

export function HomeView(props) {
  // added some variables to use for attraction card animation
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [listWidth, setListWidth] = useState(Dimensions.get("window").width);
  const [visibleAlerts, setVisibleAlerts] = useState([]);

  const baseAttractions = props.attractions || [];
  const newsItems = props.touristNews || [];
  const shouldLoop = baseAttractions.length > 1;

  const loopedAttractions = useMemo(function buildLoopedAttractionsACB() {
    if (!shouldLoop) {
      return baseAttractions;
    }

    return [
      baseAttractions[baseAttractions.length - 1],
      ...baseAttractions,
      baseAttractions[0],
    ];
  }, [baseAttractions, shouldLoop]);

  const cardWidth = Math.min(listWidth * 0.72, 320);
  const spacing = 14;
  const fullWidth = cardWidth + spacing;
  const sideSpacing = Math.max((listWidth - cardWidth) / 2 - spacing / 2, 16);

  useEffect(
    function syncAlertsACB() {
      setVisibleAlerts(props.weatherAlerts || []);
    },
    [props.weatherAlerts]
  );

  useEffect(
    function syncCarouselPositionACB() {
      if (!shouldLoop) {
        return;
      }

      const frameId = requestAnimationFrame(function scrollToFirstRealCardACB() {
        flatListRef.current?.scrollToIndex({
          index: 1,
          animated: false,
        });
      });

      return function cleanupCarouselACB() {
        cancelAnimationFrame(frameId);
      };
    },
    [shouldLoop, listWidth, loopedAttractions.length]
  );

  function dismissAlertACB(indexToRemove) {
    setVisibleAlerts(function updateAlertsACB(currentAlerts) {
      return currentAlerts.filter(function keepAlertACB(_alert, index) {
        return index !== indexToRemove;
      });
    });
  }

  function userWantsToSeeMoreACB(attraction) {
    props.onSelectAttraction?.(attraction);
  }

  function renderAlertACB(alert, index) {
    return (
      <View key={`${alert.event}-${index}`} style={styles.alertBox}>
        <View style={styles.alertHeader}>
          <Text style={styles.alertTitle}>{alert.event}</Text>

          <Pressable
            onPress={function onDismissAlertACB() {
              dismissAlertACB(index);
            }}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.refreshButtonPressed,
            ]}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        <Text style={styles.alertDescription}>{alert.description}</Text>
      </View>
    );
  }

  function renderNewsItemACB(item, index) {
    return (
      <View key={`${item.id ?? "news"}-${index}`} style={styles.newsCard}>
        <View style={styles.newsHeader}>
          <Text style={styles.newsBadge}>{item.area}</Text>
          <Text style={styles.newsSeverity}>{item.severity}</Text>
        </View>

        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsDescription}>{item.summary}</Text>

        {!!item.publishedAt && (
          <Text style={styles.newsMeta}>{item.publishedAt}</Text>
        )}
      </View>
    );
  }

  function renderAttractionRowACB({ item, index }) {
    const inputRange = [
      (index - 1) * fullWidth,
      index * fullWidth,
      (index + 1) * fullWidth,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.88, 1, 0.88],
      extrapolate: "clamp",
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [10, 0, 10],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            width: cardWidth,
            marginRight: spacing,
            transform: [{ scale }, { translateY }],
          },
        ]}
      >
        <AttractionCard
          attraction={item}
          onSeeMore={function onSeeMoreACB() {
            userWantsToSeeMoreACB(item);
          }}
        />
      </Animated.View>
    );
  }

  // added a function to make the sliding smoother
  function handleCarouselMomentumEndACB(event) {
    if (!shouldLoop) {
      return;
    }

    const offsetX = event.nativeEvent.contentOffset.x;
    const snappedIndex = Math.round(offsetX / fullWidth);

    if (snappedIndex === 0) {
      flatListRef.current?.scrollToIndex({
        index: baseAttractions.length,
        animated: false,
      });
      return;
    }

    if (snappedIndex === loopedAttractions.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: 1,
        animated: false,
      });
    }
  }

  function keyExtractorACB(item, index) {
    return `${item.id ?? "item"}-${index}`;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.mapSection}>
        <AttractionsMap
          attractions={baseAttractions}
          currentAttraction={props.currentAttraction}
        />
      </View>

      {props.loadingStatus ? (
        <Text style={styles.loadingText}>Loading safety data...</Text>
      ) : (
        visibleAlerts.map(renderAlertACB)
      )}

      <View style={styles.buttonWrapper}>
        <Pressable
          onPress={props.onRefresh}
          style={({ pressed }) => [
            styles.refreshButton,
            pressed && styles.refreshButtonPressed,
          ]}
        >
          <Text style={styles.refreshButtonText}>Refresh safety data</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Attractions</Text>

      <View
        style={styles.carouselContainer}
        onLayout={function onCarouselLayoutACB(event) {
          setListWidth(event.nativeEvent.layout.width);
        }}
      >
        <Animated.FlatList
          ref={flatListRef}
          data={loopedAttractions}
          keyExtractor={keyExtractorACB}
          renderItem={renderAttractionRowACB}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: sideSpacing }}
          snapToInterval={fullWidth}
          decelerationRate="fast"
          bounces={false}
          onMomentumScrollEnd={handleCarouselMomentumEndACB}
          scrollEventThrottle={16}
          getItemLayout={function getItemLayoutACB(_data, index) {
            return {
              length: fullWidth,
              offset: fullWidth * index,
              index,
            };
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
        />
      </View>

      <Text style={styles.sectionTitle}>Local News</Text>

      <View style={styles.newsSection}>
        {newsItems.length ? (
          newsItems.map(renderNewsItemACB)
        ) : (
          <Text style={styles.emptyNewsText}>
            No important local news for tourist areas right now.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 28,
  },
  mapSection: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    overflow: "hidden",
    height: 420,
  },
  loadingText: {
    marginHorizontal: 16,
    marginTop: 8,
    color: "#475569",
    fontSize: 14,
  },
  alertBox: {
    backgroundColor: "#fee2e2",
    padding: 12,
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  alertTitle: {
    color: "#991b1b",
    fontWeight: "700",
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fecaca",
  },
  closeButtonText: {
    fontSize: 14,
    color: "#991b1b",
    fontWeight: "700",
  },
  alertDescription: {
    color: "#7f1d1d",
  },
  buttonWrapper: {
    marginTop: 14,
    marginHorizontal: 16,
  },
  refreshButton: {
    backgroundColor: "#0f172a",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  refreshButtonPressed: {
    opacity: 0.85,
  },
  refreshButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 14,
    marginHorizontal: 16,
    color: "#111827",
  },
  carouselContainer: {
    minHeight: 300,
  },
  cardWrapper: {
    paddingBottom: 18,
  },
  newsSection: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  newsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  newsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  newsBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f766e",
    backgroundColor: "#ccfbf1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  newsSeverity: {
    fontSize: 12,
    fontWeight: "700",
    color: "#b45309",
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  newsDescription: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  newsMeta: {
    marginTop: 10,
    fontSize: 12,
    color: "#6b7280",
  },
  emptyNewsText: {
    color: "#6b7280",
    fontSize: 14,
    lineHeight: 20,
  },
});