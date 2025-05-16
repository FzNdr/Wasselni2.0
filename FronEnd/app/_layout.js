// app/_layout.js
import { Stack } from 'expo-router';
import { AppProvider } from './context/AppContext';

export default function Layout() {
  return (
    <AppProvider>
      <Stack
        initialRouteName="screens/Auth/RegisterScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="screens/Auth/LoginScreen"/>
        <Stack.Screen name="screens/Auth/RegisterScreen"/>
        <Stack.Screen name="screens/Driver/DriverHomePage"/>
        <Stack.Screen name="screens/Rider/RiderHomePage"/>
        <Stack.Screen name="screens/Profile/ProfileScreen"/>
        <Stack.Screen name="screens/Driver/Driver-RideInProgress"/>
        <Stack.Screen name="screens/Rider/Rider-RideInProgress"/>

      </Stack>
    </AppProvider>
  );
}
