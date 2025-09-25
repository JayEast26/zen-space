import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSpaceContext } from "../../contexts/SpaceContext";

export default function CreateSpace() {
  const [text, setText] = useState("");
  const { addSpace } = useSpaceContext();
  const router = useRouter();

  const handleAdd = async () => {
    if (!text.trim()) return;
    await addSpace(text);
    setText("");
    router.push("/space"); // go back to list after adding
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f6f5f2" }}>
      <Text style={{ fontSize: 28, fontWeight: "600", marginBottom: 20, textAlign: "center" }}>
        🌿 Add a New Space
      </Text>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Enter your space..."
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 12,
          marginBottom: 20,
          backgroundColor: "white"
        }}
      />

      <TouchableOpacity
        onPress={handleAdd}
        style={{
          backgroundColor: "#4CAF50",
          padding: 15,
          borderRadius: 10,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Add Space</Text>
      </TouchableOpacity>
    </View>
  );
}
