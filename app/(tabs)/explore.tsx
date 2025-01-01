import { StyleSheet, View, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import MapView, { Marker, Callout } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { POI } from "@/types/poi";
import { useTourStore } from "@/store/tourStore";
import { POINTS_OF_INTEREST } from "@/data/points";

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const getMarkerColor = (category: POI["category"]) => {
    switch (category) {
      case "landmark":
        return "#FF4B4B";
      case "sports":
        return "#4B7BFF";
      case "attraction":
        return "#4BFF4B";
      default:
        return "#FF4B4B";
    }
  };

  const handleStartTour = (poiId: string) => {
    console.log("Starting tour with POI:", poiId);
    useTourStore.getState().setSelectedPoiId(poiId);
    console.log("Store updated, navigating to tour");
    router.push("/(tabs)/tour");
  };

  return (
    <ThemedView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 43.6426,
          longitude: -79.3871,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        {POINTS_OF_INTEREST.map((poi) => (
          <Marker
            key={poi.id}
            coordinate={{
              latitude: poi.latitude,
              longitude: poi.longitude,
            }}
            pinColor={getMarkerColor(poi.category as POI["category"])}
            onCalloutPress={() => {
              console.log("Callout pressed");
              handleStartTour(poi.id);
            }}
          >
            <Callout tooltip>
              <View style={styles.callout}>
                <Image source={poi.image} style={styles.calloutImage} />
                <ThemedText style={styles.calloutTitle}>{poi.name}</ThemedText>
                <ThemedText style={styles.calloutDescription}>
                  {poi.description}
                </ThemedText>
                <View style={styles.calloutFooter}>
                  <ThemedText style={styles.rating}>
                    Rating: {poi.rating}★
                  </ThemedText>
                  <Pressable
                    style={styles.startButton}
                    onPress={() => {
                      console.log("Button pressed");
                      handleStartTour(poi.id);
                    }}
                    hitSlop={10}
                  >
                    <ThemedText style={styles.buttonText}>
                      Start Tour
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  callout: {
    width: 200,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
  },
  calloutImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
  },
  calloutDescription: {
    fontSize: 14,
    marginBottom: 8,
    color: "#000",
  },
  calloutFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    color: "#000",
  },
  startButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
