import { StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTourStore } from "@/store/tourStore";
import { POINTS_OF_INTEREST } from "@/data/points";

export default function HomeScreen() {
  const favorites = useTourStore((state) => state.favorites);
  const router = useRouter();
  const colorScheme = useColorScheme();

  const favoriteLocations = POINTS_OF_INTEREST.filter((poi) =>
    favorites.includes(poi.id)
  );

  return (
    <ScrollView style={styles.container}>
      <Image
        source={require("@/assets/images/toronto-skyline.jpg")}
        style={styles.headerImage}
      />

      <ThemedView style={styles.content}>
        <ThemedText style={styles.title}>Welcome to Toronto</ThemedText>
        <ThemedText style={styles.subtitle}>
          Your Personal Audio Guide
        </ThemedText>

        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statNumber}>15+</ThemedText>
            <ThemedText style={styles.statLabel}>Locations</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statNumber}>45m</ThemedText>
            <ThemedText style={styles.statLabel}>Audio Content</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statNumber}>4.8★</ThemedText>
            <ThemedText style={styles.statLabel}>Rating</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* <Pressable
          style={styles.startButton}
          onPress={() => {
            useTourStore.getState().setSelectedPoiId(POINTS_OF_INTEREST[0].id);
            router.push("/(tabs)/tour");
          }}
        >
          <ThemedText style={styles.buttonText}>Start Tour</ThemedText>
          <MaterialIcons
            name="arrow-forward"
            size={24}
            color={Colors[colorScheme ?? "light"].background}
          />
        </Pressable> */}

        <ThemedText style={styles.sectionTitle}>
          Featured Attractions
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.featuredContainer}
        >
          {FEATURED_PLACES.map((place) => (
            <Pressable
              key={place.id}
              style={styles.featuredCard}
              onPress={() => {
                useTourStore.getState().setSelectedPoiId(place.id);
                router.push("/(tabs)/tour");
              }}
            >
              <Image source={place.image} style={styles.featuredImage} />
              <ThemedText style={styles.featuredTitle}>{place.name}</ThemedText>
              <ThemedText style={styles.featuredDuration}>
                {place.duration} min
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        {favoriteLocations.length > 0 && (
          <>
            <ThemedText style={styles.sectionTitle}>Favorite Places</ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.favoritesContainer}
            >
              {favoriteLocations.map((place) => (
                <Pressable
                  key={place.id}
                  style={styles.favoriteCard}
                  onPress={() => {
                    useTourStore.getState().setSelectedPoiId(place.id);
                    router.push("/(tabs)/tour");
                  }}
                >
                  <Image source={place.image} style={styles.favoriteImage} />
                  <ThemedText style={styles.favoriteTitle}>
                    {place.name}
                  </ThemedText>
                  <ThemedText style={styles.favoriteRating}>
                    {place.rating}★
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const FEATURED_PLACES = [
  {
    id: "1",
    name: "CN Tower",
    image: require("@/assets/images/cn-tower.jpg"),
    duration: 15,
  },
  {
    id: "2",
    name: "Rogers Centre",
    image: require("@/assets/images/rogers-centre.jpg"),
    duration: 10,
  },
  {
    id: "3",
    name: "Ripley's Aquarium",
    image: require("@/assets/images/ripleys-aquarium.jpg"),
    duration: 20,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    paddingTop: 20,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
    marginBottom: 24,
  },
  statsContainer: {
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  startButton: {
    backgroundColor: Colors.light.tint,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  featuredContainer: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  featuredCard: {
    width: 200,
    marginRight: 16,
  },
  featuredImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  featuredDuration: {
    fontSize: 14,
    opacity: 0.7,
  },
  favoritesContainer: {
    marginBottom: 20,
    paddingBottom: 20,
  },
  favoriteCard: {
    width: 160,
    marginRight: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  favoriteImage: {
    width: "100%",
    height: 120,
  },
  favoriteTitle: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    padding: 8,
  },
  favoriteRating: {
    fontSize: 14,
    color: "#FFA500",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});
