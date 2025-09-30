import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <ImageBackground 
      source={{ uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" }}
      style={styles.background}
      blurRadius={15} // Increased blur
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>🌿 ZenSpace</Text>
          <Text style={styles.subtitle}>Find your calm. Breathe. Be present.</Text>
          
          <View style={styles.authContainer}>
            <Link href="/auth/signin" asChild>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Sign In</Text>
              </TouchableOpacity>
            </Link>
            
            <Link href="/auth/signup" asChild>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Create Account</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20, // Minimal padding
  },
  content: { 
    width: "100%",
    maxWidth: 320,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Very transparent
    borderRadius: 16,
    padding: 25, // Minimal inner padding
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  title: { 
    fontSize: 34, 
    fontWeight: "bold", 
    marginBottom: 8, 
    color: "white",
    textAlign: "center",
  },
  subtitle: { 
    fontSize: 15, 
    color: "rgba(255, 255, 255, 0.85)", 
    marginBottom: 35,
    textAlign: "center",
    lineHeight: 20,
  },
  authContainer: {
    width: "100%",
    gap: 10, // Minimal gap
  },
  primaryButton: {
    padding: 14,
    backgroundColor: "rgba(141, 166, 118, 0.85)",
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white", 
    fontSize: 15,
    fontWeight: "600",
  },
  secondaryButton: {
    padding: 14,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});