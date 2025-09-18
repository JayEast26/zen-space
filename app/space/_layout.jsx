import { Stack } from "expo-router";

export default function SpacesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Your Spaces" }} />
      <Stack.Screen name="create" options={{ title: "Add Space" }} />
    </Stack>
  );
}
