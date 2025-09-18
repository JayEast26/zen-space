// app/index.jsx
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌿 ZenSpace</Text>
      <Text style={styles.subtitle}>Find calm. Set goals. Grow daily.</Text>

      <Link style={styles.link} href="/auth/signin">Sign In</Link>
      <Link style={styles.link} href="/auth/signup">Create Account</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f7fa" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 10, color: "#2e3b4e" },
  subtitle: { fontSize: 16, color: "#7a869a", marginBottom: 40 },
  link: { marginVertical: 10, padding: 14, width: 220, textAlign: "center",
          backgroundColor: "#a5d6a7", borderRadius: 12, color: "white", fontSize: 16 },
});
