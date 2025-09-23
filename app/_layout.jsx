import { Stack } from "expo-router";
import { SpaceProvider } from "../contexts/SpaceContext";

export default function Layout() {
  return (
    <SpaceProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SpaceProvider>
  );
}