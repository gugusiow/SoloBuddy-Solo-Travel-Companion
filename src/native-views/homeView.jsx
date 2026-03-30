import { View, Text, FlatList, StyleSheet, Button } from "react-native";

export function HomeView(props) {
  
  function renderAlertACB(alert, index) {
    return (
      <View key={index} style={{ backgroundColor: '#fee2e2', padding: 10, marginTop: 10 }}>
        <Text style={{ color: '#991b1b', fontWeight: 'bold' }}>{alert.event}</Text>
        <Text>{alert.description}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mapText}>Insert Map here next timeee 🗺🗾</Text>

      {props.loadingStatus ? (<Text>Loading safety data...</Text>) : (props.weatherAlerts.map(renderAlertACB))}

      {/* When clicked, it calls the ACB defined in the Presenter */}
      <Button title="Check Area Safety" onPress={props.onRefreshData} />

      <Text style={styles.sectionTitle}>Attractions</Text>
      <FlatList
        data={props.attractions} 
        keyExtractor={keyExtractorACB}
        renderItem={renderAttractionRowACB}
      />
    </View>
  );

  function keyExtractorACB(item) {
    return item.id.toString();
  }

  function renderAttractionRowACB(element) {
    const attraction = element.item;
    return (
      <View style={styles.row}>
        <View>
          <Text style={styles.name}>{attraction.name}</Text>
          <Text style={styles.location}>{attraction.location}</Text>
        </View>
        <Text style={styles.rating}>⭐ {attraction.safetyRating}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 16 
    },
    mapText: { 
        fontSize: 18, 
        color: "#555" 
    },
    sectionTitle: { 
        fontSize: 16, 
        fontWeight: "bold", 
        marginTop: 16, 
        marginBottom: 8 
    },
    row: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        paddingVertical: 10 
    },
    name: { 
        fontWeight: "bold", 
        fontSize: 15 
    },
    location: { 
        color: "#888", 
        fontSize: 13 
    },
    rating: { 
        fontSize: 14 
    },
});