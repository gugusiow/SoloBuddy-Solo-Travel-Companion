import React, { useRef, useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Button, Animated, Dimensions, Pressable } from "react-native";
import { AttractionCard } from "./attractionCard";

export function HomeView(props) {
  // added some variables to use for attraction card animation
  const scrollX = useRef(new Animated.Value(0)).current;
  const [listWidth, setListWidth] = useState(Dimensions.get("window").width);

  const cardWidth = listWidth * 0.35;  // adjust the value to make the cards further apart
  const spacing = 5;
  const sideSpacing = (listWidth - cardWidth) / 2;

  const [visibleAlerts, setVisibleAlerts] = useState([]);

  useEffect(function syncAlertsACB() {
    setVisibleAlerts(props.weatherAlerts || []);
  }, [props.weatherAlerts]);

  function dismissAlertACB(indexToRemove) {
    setVisibleAlerts(function updateAlertsACB(currentAlerts) {
      return currentAlerts.filter(function keepAlertACB(alert, index) {
        return index !== indexToRemove;
      });
    });
  }
  
  function renderAlertACB(alert, index) {
    return (
      <View key={index} style={styles.alertBox}>
        <View style={styles.alertHeader}>
          <Text style={styles.alertTitle}>{alert.event}</Text>

          <Pressable
            onPress={function onCloseAlertACB() {
              dismissAlertACB(index);
            }}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        <Text style={styles.alertDescription}>{alert.description}</Text>
      </View>
    );
  }

  function renderCardSeparator() {
    return <View style={{ width: spacing }} />;
  }

  // made some changes to renderAttractionRowACB
  function renderAttractionRowACB({ item, index }) {
    const fullWidth = cardWidth + spacing;

    const inputRange = [(index - 1) * fullWidth,index * fullWidth,(index + 1) * fullWidth,];

    // https://docs.swmansion.com/react-native-reanimated/docs/utilities/interpolate/
    // found this cool thing we can do with react-native to map values from one range to another
    // this allows for different sized cards
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.80, 1, 0.80],
      extrapolate: "clamp", 
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [8, 0, 8],
      extrapolate: "clamp",
    });
    
    return (
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            width: cardWidth,
            transform: [{ scale }, { translateY }],
          },
        ]}
      >
        <AttractionCard attraction={item} />
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mapText}>Insert Map here next timeee 🗺🗾</Text>

      {props.loadingStatus ? (<Text>Loading safety data...</Text>) : (props.weatherAlerts.map(renderAlertACB))}

      {/* When clicked, it calls the ACB defined in the Presenter */}
      <Button title="Check Area Safety" onPress={props.onRefreshData} />

      <Text style={styles.sectionTitle}>Attractions</Text>
      {/* changed Flatlist to an animated one */}
      <Animated.FlatList
        data={props.attractions}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractorACB}
        renderItem={renderAttractionRowACB}
        ItemSeparatorComponent={renderCardSeparator}
        snapToInterval={cardWidth + spacing}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={{
          paddingHorizontal: sideSpacing,
          paddingBottom: 8,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
}

  function keyExtractorACB(item) {
    return item.id.toString();
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  mapText: {
    fontSize: 18,
    color: "#555",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  loadingText: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  alertBox: {
    backgroundColor: "#fee2e2",
    padding: 10,
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  alertTitle: {
    color: "#991b1b",
    fontWeight: "bold",
  },
  buttonWrapper: {
    marginTop: 14,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 22,
    marginBottom: 14,
    marginHorizontal: 16,
    color: "#111827",
  },
  cardWrapper: {
    paddingBottom: 10,
  },
});