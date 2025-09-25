import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSpaceContext } from "../../contexts/SpaceContext";

export default function SpacesScreen() {
  const { spaces, deleteSpace } = useSpaceContext();
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f6f5f2" }}>
      <Text style={{ fontSize: 28, fontWeight: "600", marginBottom: 20 }}>
        🌿 My Spaces
      </Text>

      <FlatList
        data={spaces}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              marginVertical: 8,
              padding: 16,
              backgroundColor: "white",
              borderRadius: 10,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 10 }}>{item.space}</Text>

            <View style={{ flexDirection: "row", gap: 15 }}>
              {/* Edit Button */}
              <TouchableOpacity
                onPress={() =>
                  router.push({ pathname: "/space/edit", params: { id: item.id, text: item.space } })
                }
              >
                <Text style={{ color: "blue" }}>Edit</Text>
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity onPress={() => deleteSpace(item.id)}>
                <Text style={{ color: "red" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Floating + Button */}
      <TouchableOpacity
        onPress={() => router.push("/space/create")}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#4CAF50",
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <Text style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
