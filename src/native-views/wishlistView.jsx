import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";

export default function WishlistView({ activeItems = [], visitedItems = [], onRemoveItem, onMarkVisited }) {
  const [visitedExpanded, setVisitedExpanded] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Itinerary</Text>

      {/* active wishlist items */}
      {activeItems.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Your saved attractions will appear here.</Text>
        </View>
      ) : (
        activeItems.map((it, idx) => (
          <View key={it.id || idx} style={styles.card}>
            <Text style={styles.cardTitle}>{it.name || it.title || "Untitled"}</Text>
            {it.location ? <Text style={styles.location}>{it.location}</Text> : null}
            {it.description ? <Text style={styles.cardSubtitle}>{it.description}</Text> : null}

            <View style={styles.cardActions}>
              {/* mark as visited button */}
              <Pressable style={styles.visitedButton} onPress={() => onMarkVisited?.(it.id, true)}>
                <Text style={styles.visitedButtonText}>Mark as Visited</Text>
              </Pressable>

              {/* button to trigger remove attraction from wishlist */}
              <Pressable style={styles.button} onPress={() => onRemoveItem?.(it.id)}>
                <Text style={styles.buttonText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}

      {/* visited places collapsible section */}
      {visitedItems.length > 0 && (
        <View style={styles.visitedSection}>
          <Pressable
            style={styles.visitedHeader}
            onPress={() => setVisitedExpanded((prev) => !prev)}
          >
            <Text style={styles.visitedHeaderText}>
              ✓ Visited Places ({visitedItems.length})
            </Text>
            <Text style={styles.chevron}>{visitedExpanded ? "▲" : "▼"}</Text>
          </Pressable>

          {visitedExpanded &&
            visitedItems.map((it, idx) => (
              <View key={it.id || idx} style={[styles.card, styles.visitedCard]}>
                <Text style={[styles.cardTitle, styles.visitedCardTitle]}>
                  {it.name || it.title || "Untitled"}
                </Text>
                {it.location ? (
                  <Text style={[styles.location, styles.visitedText]}>{it.location}</Text>
                ) : null}
                {/* undo visited */}
                <Pressable
                  style={styles.undoButton}
                  onPress={() => onMarkVisited?.(it.id, false)}
                >
                  <Text style={styles.undoButtonText}>Mark as Unvisited</Text>
                </Pressable>
              </View>
            ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  empty: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  location: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#000000",
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  visitedButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#10b981",
    borderRadius: 6,
  },
  visitedButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  visitedSection: {
    marginTop: 8,
  },
  visitedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  visitedHeaderText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#10b981",
  },
  chevron: {
    fontSize: 12,
    color: "#6b7280",
  },
  visitedCard: {
    opacity: 0.6,
    backgroundColor: "#f9fafb",
  },
  visitedCardTitle: {
    color: "#6b7280",
  },
  visitedText: {
    color: "#9ca3af",
  },
  undoButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#6b7280",
    borderRadius: 6,
    marginTop: 4,
  },
  undoButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});