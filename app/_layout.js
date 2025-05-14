// app/_layout.js
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      initialRouteName="screens/Auth/RegisterScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="screens/Auth/LoginScreen" />
      <Stack.Screen name="screens/Auth/RegisterScreen" />
      <Stack.Screen name="screens/Driver/DriverMap" />
      <Stack.Screen name="screens/Rider/RiderMap" />
    </Stack>
  );
}
