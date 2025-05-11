import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { Menu, MenuDivider, MenuItem } from 'react-native-material-menu';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Home/HomeScreen'; // Example screen
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const renderMenu = (navigation) => (
    <Menu
      ref={menuRef}
      visible={menuVisible}
      onRequestClose={() => setMenuVisible(false)}
      anchor={
        <Text
          style={{ marginRight: 10, fontSize: 16, color: 'blue' }}
          onPress={toggleMenu}
        >
          Menu
        </Text>
      }
    >
      <MenuItem onPress={() => navigation.navigate('Profile')}>Profile</MenuItem>
      <MenuDivider />
      <MenuItem onPress={() => navigation.navigate('Login')}>Logout</MenuItem>
    </Menu>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Login and Register screens without the dropdown menu */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Other screens with the dropdown menu */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerRight: () => renderMenu(navigation),
          })}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={({ navigation }) => ({
            headerRight: () => renderMenu(navigation),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
