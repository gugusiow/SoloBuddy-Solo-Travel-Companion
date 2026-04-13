import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import Svg, { Defs, LinearGradient, Stop, Path, Circle } from "react-native-svg";
import { AttractionCard } from "./attractionCard";
import { AttractionsMap } from "./attractionsMap";
import { AttractionDetailsModal } from "./attractionDetailsModal";

import styles from "./homeView.styles.js";

export function HomeView(props) {
  // added some variables to use for attraction card animation
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [listWidth, setListWidth] = useState(Dimensions.get("window").width);
  const [visibleAlerts, setVisibleAlerts] = useState([]);
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);
  const [attractionModalVisible, setAttractionModalVisible] = useState(false);

  const baseAttractions = props.attractions || [];
  const newsItems = props.touristNews || [];
  const weather = props.currentWeather || null;
  const shouldLoop = baseAttractions.length > 1;

  // add some styling to switch from day to night
  const bannerTextStyle = weather && !weather.isDaytime ? styles.weatherTextNight : null;

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
    props.onSeeMoreAttraction?.(attraction);
    setAttractionModalVisible(true);
  }

  function closeAttractionModalACB() {
    setAttractionModalVisible(false);
    props.onCloseAttractionDetails?.();
  }

  function openWeatherModalACB() {
    setWeatherModalVisible(true);
    props.onOpenWeatherDetails?.();
  }

  function closeWeatherModalACB() {
    setWeatherModalVisible(false);
  }

  function parseTimeToMinutesACB(timeText) {
    if (!timeText || typeof timeText !== "string") {
      return null;
    }

    const match = timeText.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) {
      return null;
    }

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = match[3] ? match[3].toUpperCase() : null;

    if (Number.isNaN(hours) || Number.isNaN(minutes) || minutes > 59) {
      return null;
    }

    if (meridiem) {
      if (hours < 1 || hours > 12) {
        return null;
      }

      if (hours === 12) {
        hours = 0;
      }

      if (meridiem === "PM") {
        hours += 12;
      }
    }

    if (hours > 23) {
      return null;
    }

    return hours * 60 + minutes;
  }

  function getSunProgressACB() {
    const sunrise = parseTimeToMinutesACB(weather?.sunrise);
    const sunset = parseTimeToMinutesACB(weather?.sunset);

    if (sunrise == null || sunset == null || sunset <= sunrise) {
      return 0.5;
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const progress = (currentMinutes - sunrise) / (sunset - sunrise);

    return Math.max(0, Math.min(progress, 1));
  }

  const sunProgress = getSunProgressACB();
  const sunX = 34 + sunProgress * 252;
  const sunY = 114 - Math.sin(sunProgress * Math.PI) * 72;


  function getUvColorACB(uvIndex) {
    if (uvIndex == null || uvIndex <= 2) return "#22c55e";
    if (uvIndex <= 5) return "#eab308";
    if (uvIndex <= 7) return "#f97316";
    if (uvIndex <= 10) return "#ef4444";
    return "#dc2626";
  }

  function renderWeatherMetricACB(label, value) {
    return (
      <View key={label} style={styles.weatherMetricCard}>
        <Text style={styles.weatherMetricLabel}>{label}</Text>
        <Text style={styles.weatherMetricValue}>{value ?? "--"}</Text>
      </View>
    );
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
          onSeeMore={function onSeeMorePressACB() {
            userWantsToSeeMoreACB(item);
          }}
          cardWidth={cardWidth}
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
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {weather ? (
          <Pressable
            onPress={openWeatherModalACB}
            style={({ pressed }) => [
              styles.weatherBanner,
              weather.isDaytime ? styles.weatherDay : styles.weatherNight,
              pressed && styles.weatherBannerPressed,
            ]}
          >
            <View>
              <Text style={[styles.weatherEyebrow, bannerTextStyle]}>
                Current weather
              </Text>

              <Text style={[styles.weatherTemp, bannerTextStyle]}>
                {weather.temperature}°{weather.unit || "C"}
              </Text>

              <Text style={[styles.weatherCondition, bannerTextStyle]}>
                {weather.condition}
              </Text>
            </View>

            <View style={styles.weatherAside}>
              <Text style={[styles.weatherRangeLabel, bannerTextStyle]}>
                Today
              </Text>

              <Text style={[styles.weatherRange, bannerTextStyle]}>
                H: {weather.high}° L: {weather.low}°
              </Text>

              <Text style={[styles.weatherTapHint, bannerTextStyle]}>
                Tap for details
              </Text>
            </View>
          </Pressable>
        ) : null}

        <View style={styles.mapSection}>
          <AttractionsMap
            attractions={baseAttractions}
            currentAttraction={props.currentAttraction}
            onSelectAttraction={props.onSelectAttraction}
          />
        </View>

        {props.loadingStatus ? (
          <Text style={styles.loadingText}>Loading safety data...</Text>
        ) : (
          visibleAlerts.map(renderAlertACB)
        )}

        <View style={styles.buttonWrapper}>
          <Pressable
            onPress={props.onRefreshSafetyAlerts}
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

        <View style={styles.newsSectionHeader}>
          <Text style={styles.sectionTitle}>News</Text>

          <Pressable
            onPress={props.onRefreshNews}
            style={({ pressed }) => [
              styles.newsRefreshButton,
              pressed && styles.refreshButtonPressed,
            ]}
          >
            <Text style={styles.newsRefreshIcon}>↻</Text>
          </Pressable>
        </View>

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

      <Modal
        visible={weatherModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeWeatherModalACB}
      >
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.modalOverlay} onPress={closeWeatherModalACB} />

          {/* added some conditional styling so that the weather modal card changes bg color depending on the time of day */}
          <View style={[styles.weatherModalSheet, weather?.isDaytime ? styles.weatherModalDay : null]}>
            <View style={styles.weatherModalHeader}>
              <View>
                <Text style={styles.weatherModalTitle}>Weather details</Text>
              </View>

              <Pressable
                onPress={closeWeatherModalACB}
                style={({ pressed }) => [
                  styles.weatherModalCloseButton,
                  pressed && styles.refreshButtonPressed,
                ]}
              >
                <Text style={styles.weatherModalCloseText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.weatherModalContent}
            >
              <View style={styles.weatherHeroCard}>
                <View style={styles.weatherHeroRow}>
                  <View>
                    <Text style={styles.weatherHeroEyebrow}>Current weather</Text>
                    <Text style={styles.weatherHeroTemp}>
                      {weather?.temperature ?? "--"}°{weather?.unit || "C"}
                    </Text>
                    <Text style={styles.weatherHeroCondition}>
                      {weather?.condition || "Unavailable"}
                    </Text>
                  </View>
                  <View style={styles.weatherHeroRight}>
                    <Text style={styles.weatherHeroRange}>
                      H: {weather?.high ?? "--"}°  L: {weather?.low ?? "--"}°
                    </Text>
                    {weather?.feelsLike != null && (
                      <Text style={styles.weatherHeroFeelsLike}>
                        Feels like {weather.feelsLike}°
                      </Text>
                    )}
                    {weather?.precipitationChance != null && (
                      <Text style={styles.weatherHeroPrecip}>
                        💧 {weather.precipitationChance}% rain
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {weather?.precipitationChance >= 50 && (
                <View style={styles.umbrellaTip}>
                  <Text style={styles.umbrellaTipText}>
                    ☂️  {weather.precipitationChance}% chance of rain. Rmb to bring an umbrella!
                  </Text>
                </View>
              )}

              {props.weatherDetailsLoading ? (
                <View style={styles.weatherLoadingBlock}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.weatherLoadingText}>
                    Loading detailed weather...
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.weatherMetricsGrid}>
                    <View style={[styles.weatherMetricCard, styles.uvMetricCard]}>
                      <Text style={styles.weatherMetricLabel}>UV index</Text>
                      <Text style={styles.weatherMetricDescription}>
                        {weather?.uvLabel ? `${weather.uvLabel} right now` : "Unavailable"}
                      </Text>
                      <Text style={styles.weatherMetricValue}>
                        {weather?.uvIndex ?? "--"}
                      </Text>

                      <View style={styles.uvBarTrack}>
                        <View
                          style={[
                            styles.uvBarFill,
                            {
                              width: `${Math.min(((weather?.uvIndex ?? 0) / 11) * 100, 100)}%`,
                              backgroundColor: getUvColorACB(weather?.uvIndex),
                            },
                          ]}
                        />
                      </View>
                    </View>
                    
                    {/* conditional styling for the individual components */}
                    <View style={[
                      styles.weatherMetricCard,
                      styles.humidityMetricCard,
                      weather?.isDaytime ? styles.humidityMetricCardDay : null,
                    ]}>
                      <Text style={styles.weatherMetricLabel}>Humidity</Text>
                      <Text style={styles.weatherMetricDescription}>
                        {weather?.humidity != null
                          ? "Current humidity"
                          : "Unavailable"}
                      </Text>
                      <Text style={styles.weatherMetricValue}>
                        {weather?.humidity != null ? `${weather.humidity}%` : "--"}
                      </Text>

                      <View style={styles.humidityBarTrack}>
                        <View
                          style={[
                            styles.humidityBarFill,
                            {
                              width: `${Math.min(weather?.humidity ?? 0, 100)}%`,
                            },
                          ]}
                        />
                      </View>
                    </View>

                    <View style={[
                      styles.weatherMetricCard,
                      styles.windMetricCard,
                      weather?.isDaytime ? styles.windMetricCardDay : null,
                    ]}>
                      <Text style={styles.weatherMetricLabel}>Wind</Text>
                      <Text style={styles.weatherMetricDescription}>
                        {weather?.windSpeed ? "Current wind speed" : "Unavailable"}
                      </Text>
                      <Text style={styles.weatherMetricValueSmall}>
                        {weather?.windSpeed || "--"}
                      </Text>
                    </View>

                    <View style={[styles.weatherMetricCard, styles.aqiMetricCard]}>
                      <Text style={styles.weatherMetricLabel}>Air quality</Text>
                      <Text style={styles.weatherMetricDescription}>
                        {weather?.airQuality?.label || "Unavailable"}
                      </Text>
                      <Text style={styles.weatherMetricValue}>
                        {weather?.airQuality?.aqi ?? "--"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sunCard}>
                    <View style={styles.sunCurveWrapper}>
                      <Svg style={styles.sunSvg} viewBox="0 0 320 140" preserveAspectRatio="none">
                        <Defs>
                          <LinearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.08" />
                            <Stop offset="100%" stopColor="#f59e0b" stopOpacity="0.35" />
                          </LinearGradient>
                          <LinearGradient id="arcGradient" x1="0" y1="0" x2="1" y2="0">
                            <Stop offset="0%" stopColor="#f97316" />
                            <Stop offset="50%" stopColor="#facc15" />
                            <Stop offset="100%" stopColor="#fb7185" />
                          </LinearGradient>
                          <LinearGradient id="sunGradient" x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0%" stopColor="#fef08a" />
                            <Stop offset="100%" stopColor="#f59e0b" />
                          </LinearGradient>
                        </Defs>

                        <Path d="M 20 124 Q 160 10 300 124 L 300 124 L 20 124 Z" fill="url(#skyGradient)" />
                        <Path d="M 20 124 Q 160 10 300 124" stroke="url(#arcGradient)" strokeWidth="7" fill="none" strokeLinecap="round" />
                        <Path d="M 12 126 L 308 126" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinecap="round" />
                        <Circle cx={sunX} cy={sunY} r="13" fill="url(#sunGradient)" />
                        <Circle cx={sunX} cy={sunY} r="20" fill="rgba(250, 204, 21, 0.24)" />
                      </Svg>
                    </View>

                    <View style={styles.sunTimesRow}>
                      <View>
                        <Text style={styles.sunTimeLabel}>Sunrise</Text>
                        <Text style={styles.sunTimeValue}>{weather?.sunrise ?? "--"}</Text>
                      </View>

                      <View style={styles.sunTimesRight}>
                        <Text style={styles.sunTimeLabel}>Sunset</Text>
                        <Text style={styles.sunTimeValue}>{weather?.sunset ?? "--"}</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.weatherSectionTitle}>5-day forecast</Text>

                  <View style={styles.forecastList}>
                    {(weather?.dailyForecast || []).map((day, index) => (
                      <View key={`${day.day}-${index}`} style={styles.forecastRow}>
                        <View>
                          <Text style={styles.forecastDay}>{day.day}</Text>
                          <Text style={styles.forecastCondition}>{day.condition}</Text>
                        </View>

                        <Text style={styles.forecastTemps}>
                          {day.high}° / {day.low}°
                        </Text>
                      </View>
                    ))}

                    {!weather?.dailyForecast?.length ? (
                      <Text style={styles.emptyForecastText}>
                        Forecast will appear here after detailed weather loads.
                      </Text>
                    ) : null}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <AttractionDetailsModal
        visible={attractionModalVisible}
        onClose={closeAttractionModalACB}
        attraction={props.currentAttraction}
        placeDetails={props.placeDetails}
        loading={props.placeDetailsLoading}
      />
    </View>
  );
}

// lots and lots of styling...maybe need to move it to a separate file
// okay i moved them to a separate file