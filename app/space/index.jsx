import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useSpace } from "../../hooks/useSpace";

export default function Spaces() {
  const { spaces, deleteSpace } = useSpace();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌿 ZenSpace</Text>
      <FlatList
        data={spaces}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.space}</Text>
            <Pressable style={styles.deleteBtn} onPress={() => deleteSpace(item.id)}>
              <Text style={styles.deleteText}>✕</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 20 },
  title: { fontSize: 28, fontWeight: "600", marginBottom: 20, color: "#1e293b", textAlign: "center" },
  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cardText: { fontSize: 18, color: "#334155" },
  deleteBtn: {
    backgroundColor: "#f1f5f9",
    padding: 8,
    borderRadius: 50,
  },
  deleteText: { color: "#ef4444", fontWeight: "bold", fontSize: 16 },
});
