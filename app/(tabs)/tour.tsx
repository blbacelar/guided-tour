import {
  StyleSheet,
  Pressable,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useEffect, useState, useRef } from "react";
import * as Location from "expo-location";
import { Audio, AVPlaybackStatus } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useTourStore } from "@/store/tourStore";
import { useRouter } from "expo-router";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { POI } from "@/types/poi";
import { POINTS_OF_INTEREST } from "@/data/points";

// Simulated walking path around attractions
const simulatedPath = [
  { latitude: 43.6426, longitude: -79.3871 }, // CN Tower
  { latitude: 43.6428, longitude: -79.3863 }, // Moving east
  { latitude: 43.6432, longitude: -79.3857 }, // Rogers Centre
  { latitude: 43.6424, longitude: -79.386 }, // Ripley's Aquarium
  { latitude: 43.6442, longitude: -79.3874 }, // Moving northwest
];

export default function TourScreen() {
  const selectedPoiId = useTourStore((state) => state.selectedPoiId);
  console.log("Tour Screen - selectedPoiId:", selectedPoiId);
  const colorScheme = useColorScheme();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [activePOI, setActivePOI] = useState<POI | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const pathIndex = useRef(0);
  const [duration, setDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const positionInterval = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const favorites = useTourStore((state) => state.favorites);
  const toggleFavorite = useTourStore((state) => state.toggleFavorite);

  useEffect(() => {
    console.log("Tour Screen useEffect - selectedPoiId:", selectedPoiId);
    const initializePOI = async () => {
      if (selectedPoiId) {
        console.log("Initializing POI:", selectedPoiId);
        const poi = POINTS_OF_INTEREST.find((p) => p.id === selectedPoiId);
        if (poi) {
          console.log("Found POI:", poi.name);
          setActivePOI(poi);
          await loadAudio(poi);
        }
      }
    };

    initializePOI();
  }, [selectedPoiId]);

  // Function to get marker color based on category
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

  // Calculate distance between two points in kilometers
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handlePOIProximity = async (poi: POI) => {
    if (activePOI?.id !== poi.id) {
      setActivePOI(poi);
      // Here you would implement the actual audio playback logic
      console.log(`Near ${poi.name}, would play ${poi.audioFile}`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDuration = () => {
    return duration;
  };

  const loadAudio = async (poi: POI) => {
    try {
      setIsLoading(true);
      const { sound: newSound } = await Audio.Sound.createAsync(poi.audioFile);
      if (isMuted) {
        await newSound.setVolumeAsync(0.0);
      }
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
      }
      setSound(newSound);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading audio:", error);
      setIsLoading(false);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (!sound && activePOI) {
        await loadAudio(activePOI);
        return;
      }

      if (!sound) return;

      if (isPlaying) {
        await sound.pauseAsync();
        if (positionInterval.current) {
          clearInterval(positionInterval.current);
          positionInterval.current = null;
        }
      } else {
        await sound.setRateAsync(playbackSpeed, true);
        await sound.playAsync();
        // Start tracking position
        positionInterval.current = setInterval(async () => {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            setPlaybackPosition(status.positionMillis);
            setProgress(status.positionMillis / (status.durationMillis || 1));

            if (status.didJustFinish) {
              clearInterval(positionInterval.current!);
              positionInterval.current = null;
              setIsPlaying(false);
              setProgress(0);
              setPlaybackPosition(0);
            }
          }
        }, 100);
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error playing/pausing:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (positionInterval.current) {
        clearInterval(positionInterval.current);
      }
      sound?.unloadAsync();
    };
  }, [sound]);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error("Error setting audio mode:", error);
      }
    };

    setupAudio();
  }, []);

  const handleSliderChange = async (value: number) => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const position = value * status.durationMillis!;
        await sound.setPositionAsync(position);
        setPlaybackPosition(position);
        setProgress(value);
      }
    }
  };

  // Add this function to handle speed changes
  const handleSpeedChange = async () => {
    const newSpeed = playbackSpeed === 2 ? 1 : 2;
    if (sound) {
      try {
        await sound.setRateAsync(newSpeed, true);
        setPlaybackSpeed(newSpeed);
      } catch (error) {
        console.error("Error changing playback speed:", error);
      }
    }
  };

  // Add these functions to handle skipping
  const handleSkipForward = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = status.positionMillis + 10000; // Add 10 seconds (in milliseconds)
        await sound.setPositionAsync(
          Math.min(newPosition, status.durationMillis || 0)
        );
        setPlaybackPosition(newPosition);
        setProgress(newPosition / (status.durationMillis || 1));
      }
    }
  };

  const handleSkipBackward = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.max(0, status.positionMillis - 10000); // Subtract 10 seconds
        await sound.setPositionAsync(newPosition);
        setPlaybackPosition(newPosition);
        setProgress(newPosition / (status.durationMillis || 1));
      }
    }
  };

  // Add this function to handle mute/unmute
  const handleMuteToggle = async () => {
    if (sound && sound.setVolumeAsync) {
      try {
        await sound.setVolumeAsync(isMuted ? 1.0 : 0.0);
        setIsMuted(!isMuted);
      } catch (error) {
        console.error("Error toggling mute:", error);
      }
    }
  };

  // Add this function to handle back button press
  const handleBack = () => {
    // Stop audio if playing
    if (sound && isPlaying) {
      sound.pauseAsync();
      if (positionInterval.current) {
        clearInterval(positionInterval.current);
        positionInterval.current = null;
      }
      setIsPlaying(false);
    }
    setActivePOI(null);

    // Navigate back to explore tab
    router.push("/(tabs)/explore");
  };

  return (
    <ThemedView style={styles.container}>
      {activePOI ? (
        <View style={styles.playerContainer}>
          <Image source={activePOI.image} style={styles.backgroundImage} />
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.8)"]}
            style={styles.gradient}
          />

          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </Pressable>
            <Pressable
              style={styles.favoriteButton}
              onPress={() => activePOI && toggleFavorite(activePOI.id)}
            >
              <MaterialIcons
                name={
                  favorites.includes(activePOI?.id ?? "")
                    ? "favorite"
                    : "favorite-border"
                }
                size={24}
                color="white"
              />
            </Pressable>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.titleRow}>
              <ThemedText style={styles.title}>{activePOI.name}</ThemedText>
              <ThemedText style={styles.rating}>{activePOI.rating}★</ThemedText>
            </View>
            <ThemedText style={styles.description}>
              {activePOI.description}
            </ThemedText>

            <View style={styles.mediaControls}>
              <View style={styles.progressContainer}>
                <Slider
                  style={styles.progressBar}
                  value={progress}
                  onValueChange={handleSliderChange}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor={Colors[colorScheme ?? "light"].tint}
                  thumbTintColor={Colors[colorScheme ?? "light"].tint}
                />
                <View style={styles.timeContainer}>
                  <ThemedText style={styles.timeText}>
                    {formatTime(progress * getDuration())}
                  </ThemedText>
                  <ThemedText style={styles.timeText}>
                    {formatTime(getDuration())}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.mainControls}>
                <Pressable
                  style={styles.controlButton}
                  onPress={handleSpeedChange}
                >
                  <ThemedText style={styles.speedText}>
                    {playbackSpeed}x
                  </ThemedText>
                </Pressable>

                <Pressable
                  style={styles.controlButton}
                  onPress={handleSkipBackward}
                >
                  <MaterialIcons
                    name="replay-10"
                    size={28}
                    color={Colors[colorScheme ?? "light"].tint}
                  />
                </Pressable>

                <Pressable style={styles.playButton} onPress={handlePlayPause}>
                  {isLoading ? (
                    <ActivityIndicator
                      size="large"
                      color={Colors[colorScheme ?? "light"].tint}
                    />
                  ) : (
                    <MaterialIcons
                      name={
                        isPlaying ? "pause-circle-filled" : "play-circle-filled"
                      }
                      size={64}
                      color={Colors[colorScheme ?? "light"].tint}
                    />
                  )}
                </Pressable>

                <Pressable
                  style={styles.controlButton}
                  onPress={handleSkipForward}
                >
                  <MaterialIcons
                    name="forward-10"
                    size={28}
                    color={Colors[colorScheme ?? "light"].tint}
                  />
                </Pressable>

                <Pressable
                  style={styles.controlButton}
                  onPress={handleMuteToggle}
                >
                  <MaterialIcons
                    name={isMuted ? "volume-off" : "volume-up"}
                    size={28}
                    color={Colors[colorScheme ?? "light"].tint}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <ThemedView style={styles.emptyState}>
          <ThemedText>
            Select a location from the Explore tab to start a tour
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  playerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 140,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  rating: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFA500",
  },
  description: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 24,
    marginBottom: 24,
  },
  mediaControls: {
    marginBottom: 60,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 16,
  },
  progressBar: {
    width: "100%",
    height: 20,
  },
  timeContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    opacity: 0.7,
  },
  mainControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  controlButton: {
    padding: 8,
    borderRadius: 20,
  },
  playButton: {
    padding: 8,
    transform: [{ scale: 1.4 }],
  },
  speedText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.tint,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
