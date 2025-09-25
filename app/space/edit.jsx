import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSpaceContext } from "../../contexts/SpaceContext";

export default function EditSpace() {
  const { id, text } = useLocalSearchParams(); // get params from router
  const [newText, setNewText] = useState(text || "");
  const { updateSpace } = useSpaceContext();
  const router = useRouter();

  const handleUpdate = async () => {
    if (!newText.trim()) return;
    await updateSpace(id, newText);
    router.push("/space");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f6f5f2" }}>
      <Text style={{ fontSize: 28, fontWeight: "600", marginBottom: 20, textAlign: "center" }}>
        ✏️ Edit Space
      </Text>

      <TextInput
        value={newText}
        onChangeText={setNewText}
        placeholder="Update your space..."
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 12,
          marginBottom: 20,
          backgroundColor: "white",
        }}
      />

      <TouchableOpacity
        onPress={handleUpdate}
        style={{
          backgroundColor: "#2196F3",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Update</Text>
      </TouchableOpacity>
    </View>
  );
}
