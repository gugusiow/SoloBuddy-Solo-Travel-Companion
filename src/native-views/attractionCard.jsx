import { View, Text, StyleSheet } from "react-native";

// create an AttractionCard component to reuse
export function AttractionCard({ attraction }) {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{attraction.name}</Text>
        <Text style={styles.location}>{attraction.location}</Text>

        <View style={styles.footerRow}>
          <Text style={styles.ratingBadge}>⭐ {attraction.safetyRating}</Text>
          <Text style={styles.footerText}>Safe to visit</Text>
        </View>
      </View>
    </View>
  );
}

// playing around with different styles...
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    width: 500,
  },
  imagePlaceholder: {
    height: 150,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  imageEmoji: {
    fontSize: 42,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111827",
  },
  location: {
    color: "#6b7280",
    fontSize: 14,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingBadge: {
    fontSize: 14,
    fontWeight: "600",
    backgroundColor: "#ecfeff",
    color: "#155e75",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  footerText: {
    fontSize: 13,
    color: "#888",
  },
});