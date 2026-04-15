import React from "react";
import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";

export default function WishlistView({ items = [], onRemoveItem }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Itinerary</Text>

      {items.length === 0 ? (
        <View style={styles.empty}
        >
          <Text style={styles.emptyText}>Your saved attractions will appear here.</Text>
        </View>
      ) : (
        items.map((it, idx) => (
          <View key={it.id || idx} style={styles.card}>
            <Text style={styles.cardTitle}>{it.name || it.title || "Untitled"}</Text>
            {it.location ? <Text style={styles.location}>{it.location}</Text> : null}
            {it.description ? <Text style={styles.cardSubtitle}>{it.description}</Text> : null}

            {/* button to trigger remove attraction from wishlist */}
            <Pressable style={styles.button} onPress={() => onRemoveItem?.(it.id)}>
              <Text style={styles.buttonText}>Remove</Text>
            </Pressable>
          </View>
        ))
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
  button: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#000000",
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
