import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* This removes the top header bar from the 'index' screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}