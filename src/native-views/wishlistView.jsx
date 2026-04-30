import React, { useState } from "react";
import { ScrollView, View, Text, Pressable, ActivityIndicator } from "react-native";
import { styles } from "./wishlistStyles";

export default function WishlistView({
  activeItems = [],
  visitedItems = [],
  activeCount = 0,
  canGenerate = false,
  itineraryState = {},
  onGenerateItinerary,
  onRemoveItem,
  onMarkVisited,
}) {
  const [visitedExpanded, setVisitedExpanded] = useState(false);

  const itineraryLoading = !!itineraryState.promise && !itineraryState.data && !itineraryState.error;
  const itineraryError = itineraryState.error;
  const itineraryData = itineraryState.data;
  const generateDisabled = !canGenerate || itineraryLoading;
  // i keep it 5 to make it usable. Myabe can explore to asking it to "recommend?"
  const placesNeeded = Math.max(0, 5 - activeCount);

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>My Itinerary</Text>


        {/* itinerary result */}
        {itineraryData ? (
          <View style={{ marginBottom: 16 }}>
            {itineraryData.summary ? (
              <Text style={styles.itinerarySummary}>{itineraryData.summary}</Text>
            ) : null}
            <Text style={styles.aiWarningText}>
              ⚠️ This itinerary is AI generated. Please verify details before your trip.
            </Text>
            {(itineraryData.days || []).map((day, dayIdx) => (
              <View key={day.day ?? dayIdx} style={[styles.card, styles.dayCard]}>
                <Text style={styles.dayHeader}>
                  Day {day.day ?? dayIdx + 1}
                  {day.theme ? ` · ${day.theme}` : ""}
                </Text>
                {(day.stops || []).map((stop, stopIdx) => (
                  <View key={stop.attractionId || stopIdx} style={styles.stopRow}>
                    <Text style={styles.stopTime}>{stop.time || "--:--"}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stopName}>{stop.name || "Untitled stop"}</Text>
                      {stop.tip ? <Text style={styles.stopTip}>{stop.tip}</Text> : null}
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* active wishlist items */}
        {activeItems.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 16, color: "#666" }}>Your saved attractions will appear here.</Text>
        </View>
      ) : (
        activeItems.map((it, idx) => (
          <View key={it.id || idx} style={styles.card}>
            <Text style={styles.cardTitle}>{it.name || it.title || "Untitled"}</Text>
            {it.location ? <Text style={styles.location}>{it.location}</Text> : null}
            {it.description ? <Text style={styles.cardSubtitle}>{it.description}</Text> : null}

            <View style={styles.cardActions}>
              {/* mark as visited button */}
              <Pressable style={[styles.actionButton, { backgroundColor: "#10b981" }]} onPress={() => onMarkVisited?.(it.id, true)}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>Mark as Visited</Text>
              </Pressable>

              {/* button to trigger remove attraction from wishlist */}
              <Pressable style={[styles.actionButton, { backgroundColor: "#000000" }]} onPress={() => onRemoveItem?.(it.id)}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>Remove</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}

      {/* visited places collapsible section */}
      {visitedItems.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Pressable
            style={styles.visitedHeader}
            onPress={() => setVisitedExpanded((prev) => !prev)}
          >
            <Text style={styles.visitedHeaderText}>
              ✓ Visited Places ({visitedItems.length})
            </Text>
            <Text style={{ fontSize: 12, color: "#6b7280" }}>{visitedExpanded ? "▲" : "▼"}</Text>
          </Pressable>

          {visitedExpanded &&
            visitedItems.map((it, idx) => (
              <View key={it.id || idx} style={[styles.card, { opacity: 0.6, backgroundColor: "#f9fafb" }]}>
                <Text style={[styles.cardTitle, { color: "#6b7280" }]}>
                  {it.name || it.title || "Untitled"}
                </Text>
                {it.location ? (
                  <Text style={[styles.location, { color: "#9ca3af" }]}>{it.location}</Text>
                ) : null}
                {/* undo visited */}
                <Pressable
                  style={[styles.actionButton, { backgroundColor: "#6b7280", alignSelf: "flex-start", marginTop: 4 }]}
                  onPress={() => onMarkVisited?.(it.id, false)}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Mark as Unvisited</Text>
                </Pressable>
              </View>
            ))}
        </View>
      )}
      </ScrollView>

      {/* stick gen btn */}
      <View style={styles.stickyFooter}>
        <Pressable
          style={[styles.generateButton, generateDisabled && { backgroundColor: "#9ca3af" }]}
          onPress={onGenerateItinerary}
          disabled={generateDisabled}
        >
          {itineraryLoading ? (
            <View style={styles.generateLoadingRow}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.generateButtonText}>✨ Building AI itinerary…</Text>
            </View>
          ) : (
            <Text style={styles.generateButtonText}>✨ Generate AI Itinerary</Text>
          )}
        </Pressable>
        {itineraryError ? (
          <Text style={styles.errorHint}>Generation failed — tap to try again.</Text>
        ) : null}
        {!canGenerate && placesNeeded > 0 ? (
          <Text style={styles.generateHelper}>
            Add {placesNeeded} more place{placesNeeded === 1 ? "" : "s"} to generate an itinerary.
          </Text>
        ) : null}
      </View>
    </View>
  );
}
