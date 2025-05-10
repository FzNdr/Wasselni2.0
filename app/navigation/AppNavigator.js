import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import DriverMap from '../screens/Driver/DriverMap';
import RideInProgress from '../screens/Driver/RideInProgress';
import RequestRideScreen from '../screens/Rider/RequestRideScreen';
import RiderMap from '../screens/Rider/RiderMap';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={RiderMap} />
      <Stack.Screen name="RequestRide" component={RequestRideScreen} />
      <Stack.Screen name="DriverMap" component={DriverMap} />
      <Stack.Screen name="RideInProgress" component={RideInProgress} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
