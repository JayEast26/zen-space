// app/zen/_layout.jsx
import { Stack } from "expo-router";

export default function ZenLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: true,
      headerStyle: { backgroundColor: "#f5f7fa" },
      headerTintColor: "#2e3b4e"
    }}>
      <Stack.Screen name="index" options={{ title: "Zen Practices" }} />
      <Stack.Screen name="breathe" options={{ title: "Breathing Exercise" }} />
      <Stack.Screen name="timer" options={{ title: "Meditation Timer" }} />
      <Stack.Screen name="bell" options={{ title: "Mindful Bell" }} />
    </Stack>
  );
}