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

const COLORS = {
  primary: "#4F46E5",   // purple/blue
  success: "#10B981",   // green
  danger: "#EF4444",    // red
  background: "#F3F4F6",
  card: "#FFFFFF",
  text: "#111827",
  subtext: "#6B7280",
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.background,
    flexGrow: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: COLORS.text,
  },

  empty: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    fontSize: 16,
    color: COLORS.subtext,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: COLORS.text,
  },

  cardSubtitle: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: 8,
  },

  location: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 10,
  },

  cardActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },

  // Primary button
  visitedButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    alignItems: "center",
  },

  visitedButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  // Secondary button
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.danger,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  visitedSection: {
    marginTop: 10,
  },

  visitedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  visitedHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.success,
  },

  chevron: {
    fontSize: 12,
    color: COLORS.subtext,
  },

  visitedCard: {
    opacity: 0.7,
    backgroundColor: "#F9FAFB",
  },

  visitedCardTitle: {
    color: COLORS.subtext,
  },

  visitedText: {
    color: "#9CA3AF",
  },

  undoButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#374151",
    borderRadius: 8,
    marginTop: 6,
  },

  undoButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});