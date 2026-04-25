import { StyleSheet } from "react-native";
import { shared } from "./sharedStyles.js";

const styles = StyleSheet.create({
  ...shared,

  // map + search
  mapContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  mapSearchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  mapSearchInput: {
    flex: 1,
    fontSize: 17,
    color: "#111827",
  },
  mapSearchIcon: {
    paddingLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  mapSearchIconText: {
    fontSize: 18,
  },
  mapSearchClearText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "700",
  },
  mapSection: {
    borderRadius: 14,
    overflow: "hidden",
    height: 420,
  },

  // attractions carousel
  carouselContainer: {
    minHeight: 300,
  },
  cardWrapper: {
    paddingBottom: 18,
  },
});

export default styles;
