import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";

export default function ZenHub() {
  const practices = [
    { 
      title: "🌬️ Breathing Anchor", 
      description: "Follow your breath", 
      href: "/zen/breathe",
      stats: "4-7-8 technique"
    },
    { 
      title: "⏰ Meditation Timer", 
      description: "Set mindful sessions", 
      href: "/zen/timer",
      stats: "Custom durations"
    },
    { 
      title: "🔔 Mindful Bell", 
      description: "Random mindful pauses", 
      href: "/zen/bell",
      stats: "Gentle reminders"
    },
    { 
      title: "🌅 Sunset Reflection", 
      description: "Evening wind-down", 
      href: "/zen/sunset",
      stats: "Daily practice"
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Zen Practices</Text>
        <Text style={styles.subtitle}>Choose your mindful moment</Text>
      </View>
      
      {practices.map((practice, index) => (
        <Link key={index} href={practice.href} asChild>
          <TouchableOpacity style={styles.practiceCard}>
            <View style={styles.practiceHeader}>
              <Text style={styles.practiceTitle}>{practice.title}</Text>
              <View style={styles.statsBadge}>
                <Text style={styles.statsText}>{practice.stats}</Text>
              </View>
            </View>
            <Text style={styles.practiceDesc}>{practice.description}</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.random() * 60 + 40}%` }]} />
              </View>
              <Text style={styles.progressText}>Ready</Text>
            </View>
          </TouchableOpacity>
        </Link>
      ))}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>🎵 Sounds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>📝 Journal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>🌿 Spaces</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 8, 
    color: "#2e3b4e",
  },
  subtitle: { 
    fontSize: 16, 
    color: "#7a869a", 
    textAlign: "center"
  },
  practiceCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  practiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e3b4e",
    flex: 1,
  },
  statsBadge: {
    backgroundColor: "#e8f4f8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statsText: {
    fontSize: 10,
    color: "#8da676",
    fontWeight: "500",
  },
  practiceDesc: {
    fontSize: 14,
    color: "#7a869a",
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8da676",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "#8da676",
    fontWeight: "500",
  },
  quickActions: {
    marginTop: 10,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e3b4e",
    marginBottom: 15,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
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
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2e3b4e",
  },
});