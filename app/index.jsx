import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.greeting}>For you</Text>
      </View>

      {/* Calm Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Calm</Text>
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Avoidout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Mindful</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Health</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Meditation Ready Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ready to start meditation</Text>
        <View style={styles.meditationCard}>
          <View style={styles.meditationStats}>
            <Text style={styles.stat}>Repeated and correct</Text>
            <Text style={styles.stat}>Pushed</Text>
            <Text style={styles.stat}>& mins</Text>
          </View>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Begin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Emotional Wellness Section */}
      <View style={styles.section}>
        <View style={styles.dualSection}>
          <View style={styles.halfSection}>
            <Text style={styles.sectionTitle}>Emotional Wellness</Text>
            <TouchableOpacity style={styles.wellnessCard}>
              <Text style={styles.cardTitle}>Finding Calm</Text>
              <Text style={styles.subtitle}>Emotional Intelligence</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.halfSection}>
            <Text style={styles.sectionTitle}>Micro Hits</Text>
            <TouchableOpacity style={styles.microCard}>
              <Text style={styles.cardTitle}>Quick Sessions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Relax Your Mind Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Relax your mind</Text>
        <Text style={styles.subtitle}>Right Episode</Text>
        
        <View style={styles.episodeCard}>
          <View style={styles.timeIndicator}>
            <Text style={styles.timeText}>0:24</Text>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.timeText}>08:00</Text>
          </View>
          <TouchableOpacity style={styles.playButton}>
            <Text style={styles.playButtonText}>▶ Play</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Links */}
      <View style={styles.authContainer}>
        <Link href="/auth/signin" asChild>
          <TouchableOpacity style={styles.authLink}>
            <Text style={styles.authText}>Sign In</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/auth/signup" asChild>
          <TouchableOpacity style={styles.authLink}>
            <Text style={styles.authText}>Create Account</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8faf9",
    paddingHorizontal: 20
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e3b4e",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e3b4e",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "#7a869a",
    marginBottom: 10,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2e3b4e",
  },
  meditationCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  meditationStats: {
    marginBottom: 15,
  },
  stat: {
    fontSize: 12,
    color: "#7a869a",
    marginBottom: 5,
  },
  startButton: {
    backgroundColor: "#8da676",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontWeight: "600",
  },
  dualSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfSection: {
    flex: 1,
    marginHorizontal: 5,
  },
  wellnessCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  microCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    height: 80,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  episodeCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  timeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  timeText: {
    fontSize: 12,
    color: "#7a869a",
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "30%",
    backgroundColor: "#8da676",
    borderRadius: 2,
  },
  playButton: {
    backgroundColor: "#8da676",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  playButtonText: {
    color: "white",
    fontWeight: "600",
  },
  authContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 30,
    gap: 20,
  },
  authLink: {
    padding: 12,
  },
  authText: {
    color: "#8da676",
    fontWeight: "500",
  },
});