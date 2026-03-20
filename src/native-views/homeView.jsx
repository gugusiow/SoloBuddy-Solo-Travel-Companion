import { View, Text, FlatList, StyleSheet } from "react-native"

export function HomeView(props) {
    return (
        <View style={styles.container}>
            <View style={styles.mapPlaceholder}>
                <Text style={styles.mapText}>Insert Map here next timeee</Text>
            </View>

            <Text style={styles.sectionTitle}>Attractions</Text>

            <FlatList
                data={props.attractions}
                keyExtractor={keyExtractorACB}
                renderItem={renderAttractionRowACB}
            />
        </View>
    )

    function keyExtractorACB(item) {
        return item.id.toString()
    }

    function renderAttractionRowACB(element) {
        const attraction = element.item
        return (
            <View style={styles.row}>
                <View>
                    <Text style={styles.name}>{attraction.name}</Text>
                    <Text style={styles.location}>{attraction.location}</Text>
                </View>
                <Text style={styles.rating}>⭐ {attraction.safetyRating}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    mapText: {
        fontSize: 18,
        color: "#555",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,

    },
    name: {
        fontWeight: "bold",
        fontSize: 15,
    },
    location: {
        color: "#888",
        fontSize: 13,
    },
    rating: {
        fontSize: 14,
    },
})
