import { Stack } from 'expo-router';
import { AppProvider } from './contexts/AppContext';

export default function Layout() {
  return (
    <AppProvider>
      <Stack
        initialRouteName="Auth/RegisterScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Auth/LoginScreen" />
        <Stack.Screen name="Auth/DriverApplicationStatus" />
        <Stack.Screen name="Auth/RegisterScreen" />
        <Stack.Screen name="Driver/DriverMap" />
        <Stack.Screen name="Driver/DriverHomePage" />
        <Stack.Screen name="Rider/RiderMap" />
        <Stack.Screen name="Rider/RiderHomePage" />
        <Stack.Screen name="Profile/ProfileScreen" />
        <Stack.Screen name="Profile/RideHistoryScreen" />



      </Stack>
    </AppProvider>
  );
}
